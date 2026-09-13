# main.py — NEXT SCENE: 최근 개봉작의 관객 예측 리포트
from datetime import datetime
from io import BytesIO
from urllib.request import urlopen
from zoneinfo import ZoneInfo

import pandas as pd
import plotly.express as px
import streamlit as st
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_absolute_error, r2_score

ROOT = "https://raw.githubusercontent.com/greatsong/modudata/main/data/"
FONT_URL = "https://raw.githubusercontent.com/google/fonts/main/ofl/nanumgothic/NanumGothic-Bold.ttf"
BASE = ["first_scrn", "first_show", "peak"]
EXTRA = {"배우 수": "actors_n", "주연 수": "lead_n", "상영시간": "showTm",
         "청소년관람불가": "adult", "대형 배급사": "bigco"}
LABELS = dict(zip(BASE, ["첫 관측일 스크린 수", "첫 관측일 상영 횟수", "성수기 개봉"]))
LABELS.update({v: k for k, v in EXTRA.items()})
NEEDED = ["actors_n", "lead_n", "showTm", "watchGrade", "company"]


@st.cache_data(ttl=3600, show_spinner=False)
def fetch(url):
    with urlopen(url, timeout=25) as response:
        return response.read()


def prepare(movies, people, daily, today):
    # '최근'은 달력과 실제 데이터 마지막 날짜를 모두 확인한다.
    daily = daily.copy()
    daily["관측일"] = pd.to_datetime(daily["날짜"].astype(str), format="%Y%m%d", errors="coerce")
    daily = daily[daily["관측일"].notna() & (daily["관측일"] <= today)]
    if daily.empty:
        raise ValueError("오늘까지의 관측 기록이 없습니다.")
    asof = daily["관측일"].max()
    if movies["movieCd"].duplicated().any() or people["movieCd"].duplicated().any():
        raise ValueError("영화 코드가 중복되어 있습니다. 데이터 갱신 후 다시 확인하세요.")
    df = movies.merge(people[["movieCd", "director"] + NEEDED], on="movieCd", how="inner", validate="one_to_one")
    merged_n = len(df)
    for col in BASE + ["actors_n", "lead_n", "showTm"]:
        df[col] = pd.to_numeric(df[col], errors="coerce")
    for col in ["watchGrade", "company"]:
        df[col] = df[col].replace(r"^\s*$", pd.NA, regex=True)
    missing = df[BASE + NEEDED].isna().sum()
    df["개봉일"] = pd.to_datetime(df["openDt"].astype(str), format="%Y%m%d", errors="coerce")
    df["첫 관측일"] = pd.to_datetime(df["first_date"].astype(str), format="%Y%m%d", errors="coerce")
    df = df.dropna(subset=BASE + NEEDED + ["개봉일", "첫 관측일"])
    df = df[(df["first_scrn"] > 0) & (df["first_show"] > 0) & (df["showTm"] > 0)
            & (df["첫 관측일"] <= asof) & (df["개봉일"] <= asof)].copy()
    df["adult"] = (df["watchGrade"] == "청소년관람불가").astype(int)
    # 관측일이 확인되는 일별 표의 마지막 누적관객을 사용한다.
    latest = daily.sort_values("관측일").drop_duplicates("영화코드", keep="last")
    latest = latest[["영화코드", "관측일", "누적관객"]].rename(columns={
        "영화코드": "movieCd", "관측일": "마지막 관측일", "누적관객": "관측 누적관객"})
    latest["관측 누적관객"] = pd.to_numeric(latest["관측 누적관객"], errors="coerce")
    df = df.merge(latest, on="movieCd", how="inner", validate="one_to_one")
    df = df.dropna(subset=["관측 누적관객"])
    df = df[df["관측 누적관객"] > 0].copy()
    df["total_audi"] = df["관측 누적관객"]
    # 최근 30일 개봉작은 예측 전용. 최소 60일 지난 작품만 훈련·테스트에 쓴다.
    cutoff = asof - pd.Timedelta(days=60)
    history = df[df["개봉일"] <= cutoff].sort_values("movieCd").reset_index(drop=True)
    recent = df[df["개봉일"] > asof - pd.Timedelta(days=30)].copy()
    mask = history.index % 10 < 3
    train, test = history[~mask].copy(), history[mask].copy()
    if len(train) < 20 or len(test) < 5:
        raise ValueError("훈련·테스트에 쓸 과거 영화가 부족합니다.")
    # 배급사 상위 5곳도 훈련 데이터로만 정한다.
    big = train["company"].value_counts().head(5).index
    for part in [train, test, recent]:
        part["bigco"] = part["company"].isin(big).astype(int)
    recent = recent.sort_values(["개봉일", "first_scrn"], ascending=[False, False])
    return train, test, recent, asof, missing, merged_n


def evaluate(model, data, cols):
    pred = model.predict(data[cols])
    r2 = r2_score(data["total_audi"], pred) if data["total_audi"].nunique() > 1 else float("nan")
    return {"영화 수": len(data), "R²": r2,
            "MAE(명)": mean_absolute_error(data["total_audi"], pred)}


def score(train, test, cols):
    model = LinearRegression().fit(train[cols], train["total_audi"])
    return model, evaluate(model, train, cols), evaluate(model, test, cols)


st.set_page_config(page_title="NEXT SCENE · 관객 예측", page_icon="🎬", layout="wide")
st.title("NEXT SCENE")
st.caption("속성을 더 모으면 예측이 달라질까 · 최근 개봉작 관객 예측 리포트")
try:
    movies = pd.read_csv(BytesIO(fetch(ROOT + "kobis_movies.csv")), encoding="utf-8-sig", dtype={"movieCd": str})
    people = pd.read_csv(BytesIO(fetch(ROOT + "kobis_people.csv")), encoding="utf-8-sig", dtype={"movieCd": str})
    daily = pd.read_csv(BytesIO(fetch(ROOT + "kobis_daily.csv")), encoding="utf-8-sig", dtype={"영화코드": str, "날짜": str})
    today = pd.Timestamp(datetime.now(ZoneInfo("Asia/Seoul")).date())
    train, test, recent, asof, missing, merged_n = prepare(movies, people, daily, today)
except Exception as error:
    st.error(f"데이터를 불러오지 못했습니다. 잠시 뒤 다시 실행하세요. ({type(error).__name__}: {error})")
    st.stop()

st.info(f"데이터 기준일 {asof:%Y.%m.%d} · 최근 30일 개봉작 {len(recent)}편 · 훈련 {len(train)}편 / 테스트 {len(test)}편")
if (today - asof).days > 2:
    st.warning(f"데이터가 {(today-asof).days}일 전 기록입니다. 현재 상영작 전체와 다를 수 있습니다.")
st.caption("최근 개봉작은 학습·평가에 넣지 않습니다. 과거 영화의 마지막 관측 누적관객을 예측 목표로 삼으며, 최종 관객 수가 확정되었다는 뜻은 아닙니다.")
with st.expander("합친 데이터 확인"):
    st.write(f"영화 표 {len(movies)}편 · 인물 표 {len(people)}편 · 합친 표 {merged_n}편")
    st.write("열별 결측 편수", missing)
    st.dataframe(train[["movieNm", "director", "first_scrn", "actors_n", "showTm", "total_audi"]].head(10))
    st.plotly_chart(px.scatter(train, x="showTm", y="total_audi", hover_name="movieNm", log_y=True,
                              labels={"showTm": "상영시간(분)", "total_audi": "관측 누적관객(명)"}), key="duration")
    grades = train.groupby("watchGrade")["total_audi"].agg(중앙값="median", 편수="size").reset_index()
    st.plotly_chart(px.bar(grades, x="watchGrade", y="중앙값", text="편수"), key="grades")

# STEP 4 — 속성을 하나씩 넣어 비교
st.header("1. 속성을 하나씩 넣어 본다")
_, base_train, base_test = score(train, test, BASE)
rows = []
for label, added in [("기본 세 가지", [])] + [(k, [v]) for k, v in EXTRA.items()]:
    _, tr, te = score(train, test, BASE + added)
    rows.append({"넣은 속성": label, "훈련 R²": tr["R²"], "테스트 R²": te["R²"],
                 "훈련 MAE(명)": tr["MAE(명)"], "테스트 MAE(명)": te["MAE(명)"],
                 "기본 대비 테스트 R² 차이": te["R²"] - base_test["R²"]})
st.dataframe(pd.DataFrame(rows).style.format(precision=3))
st.plotly_chart(px.bar(pd.DataFrame(rows), x="기본 대비 테스트 R² 차이", y="넣은 속성", orientation="h"), key="features")

# STEP 5 — 훈련과 테스트를 같은 크기로 비교
st.header("2. 고른 속성으로 다시 학습한다")
picked_names = st.multiselect("기본 세 가지에 더할 속성", list(EXTRA), default=[])
cols = BASE + [EXTRA[name] for name in picked_names]
model, train_score, test_score = score(train, test, cols)
comparison = pd.DataFrame([{"데이터": "훈련용", **train_score}, {"데이터": "테스트용", **test_score}])
st.dataframe(comparison.style.format({"R²": "{:.3f}", "MAE(명)": "{:,.0f}"}), hide_index=True)
left, right = st.columns(2)
for panel, title, values in [(left, "훈련용", train_score), (right, "테스트용", test_score)]:
    panel.subheader(f"{title} · {values['영화 수']}편")
    panel.metric("R²", f"{values['R²']:.3f}")
    panel.metric("MAE", f"{values['MAE(명)']:,.0f}명")
st.caption("훈련 점수는 학습한 데이터에 맞는 정도, 테스트 점수는 학습하지 않은 영화에서의 성능입니다. 훈련 점수만 좋아지고 테스트 점수는 나빠지는지 비교합니다.")
with st.expander("가중치와 테스트 예측 살펴보기"):
    weights = pd.DataFrame({"속성": [LABELS[c] for c in cols], "가중치": model.coef_})
    st.plotly_chart(px.bar(weights, x="가중치", y="속성", orientation="h", color=weights["가중치"] >= 0), key="weights")
    st.caption("단위가 다르면 가중치의 크기를 그대로 비교할 수 없습니다.")
    look = test.assign(예측=model.predict(test[cols]))
    fig = px.scatter(look, x="total_audi", y="예측", hover_name="movieNm", labels={"total_audi": "실젯값(명)"})
    lo = min(0, float(look["예측"].min()))
    hi = float(max(look["total_audi"].max(), look["예측"].max()))
    fig.add_shape(type="line", x0=lo, y0=lo, x1=hi, y1=hi, line={"dash": "dash", "color": "#777"})
    st.plotly_chart(fig, key="predictions")
    st.caption("대각선 위에서는 더 크게, 아래에서는 더 작게 예측했습니다. 음수 예측도 보이도록 선형 축을 사용합니다.")

# STEP 6 — 훈련 데이터의 이상치 후보를 검토하고 다시 평가
st.header("3. 이상치 후보를 검토하고 다시 평가한다")
errors = train[["movieCd", "movieNm", "total_audi"]].copy()
errors["예측"] = model.predict(train[cols])
errors["절대오차"] = (errors["total_audi"] - errors["예측"]).abs()
q1, q3 = errors["절대오차"].quantile([0.25, 0.75])
threshold = q3 + 1.5 * (q3 - q1)
candidates = errors[errors["절대오차"] > threshold].sort_values("절대오차", ascending=False)
st.caption("훈련 영화 중 절대오차가 Q3 + 1.5 × IQR보다 큰 영화를 후보로 표시합니다. IQR은 가운데 50% 범위의 폭(Q3 − Q1)입니다. 후보라고 데이터 오류인 것은 아닙니다. 실제 흥행작도 있을 수 있습니다.")
st.subheader("산점도에서 먼저 확인하기")
errors["구분"] = errors["절대오차"].gt(threshold).map({True: "이상치 후보", False: "나머지 훈련 영화"})
fig = px.scatter(errors, x="total_audi", y="예측", color="구분", symbol="구분",
                 hover_name="movieNm", hover_data={"movieCd": True, "절대오차": ":,.0f", "total_audi": ":,.0f", "예측": ":,.0f"},
                 labels={"total_audi": "실제 관측 누적관객(명)", "예측": "모델 예측 관객(명)", "movieCd": "영화 코드"},
                 color_discrete_map={"이상치 후보": "#d95f02", "나머지 훈련 영화": "#2878b5"},
                 symbol_map={"이상치 후보": "diamond", "나머지 훈련 영화": "circle"})
low = min(0, errors["total_audi"].min(), errors["예측"].min())
high = max(errors["total_audi"].max(), errors["예측"].max())
padding = max((high - low) * 0.05, 1)
fig.add_shape(type="line", x0=low, y0=low, x1=high, y1=high,
              line={"color": "#666666", "dash": "dash"})
fig.update_traces(marker={"size": 10, "opacity": 0.8})
fig.update_xaxes(range=[low-padding, high+padding], tickformat=",")
fig.update_yaxes(range=[low-padding, high+padding], tickformat=",")
fig.update_layout(height=540, legend_title_text="훈련 영화", legend={"orientation": "h", "y": 1.12})
st.plotly_chart(fig, key="outlier-review")
st.caption("점선은 실젯값과 예측값이 같은 위치입니다. 점선 위는 크게, 아래는 작게 예측한 영화이며, 같은 실젯값에서 점선과의 세로 차이가 오차입니다. 주황색 마름모는 이상치 후보입니다.")
st.info("점에 마우스를 올려 영화 이름·실젯값·예측값·절대오차를 확인하세요. 필요하면 드래그로 확대합니다. 다른 영화와 얼마나 떨어져 있는지와 실제 흥행작인지 살핀 뒤, 아래에서 제외 여부를 결정하세요.")
st.dataframe(candidates.rename(columns={"movieNm": "영화", "total_audi": "관측 누적관객"}), hide_index=True)
candidate_names = candidates.set_index("movieCd")["movieNm"].to_dict()
excluded = st.multiselect("제외할 훈련 영화 · 선택하면 바로 재평가", candidates["movieCd"].tolist(),
                         format_func=lambda code: candidate_names[code], key="excluded-movies")
active_train = train[~train["movieCd"].isin(excluded)].copy()
if len(active_train) < 20:
    st.error("제외 후 훈련 영화가 20편 미만입니다. 제외할 영화를 줄여 주세요.")
    st.stop()
before_train, before_test = train_score, test_score
model, train_score, test_score = score(active_train, test, cols)
recheck = pd.DataFrame([
    {"단계": "제외 전", "데이터": "훈련용", **before_train},
    {"단계": "제외 전", "데이터": "테스트용", **before_test},
    {"단계": "제외 후", "데이터": "훈련용", **train_score},
    {"단계": "제외 후", "데이터": "테스트용", **test_score},
])
st.dataframe(recheck.style.format({"R²": "{:.3f}", "MAE(명)": "{:,.0f}"}), hide_index=True)
a, b = st.columns(2)
a.metric("재평가 테스트 R²", f"{test_score['R²']:.3f}", f"{test_score['R²']-before_test['R²']:+.3f}")
b.metric("재평가 테스트 MAE", f"{test_score['MAE(명)']:,.0f}명",
         f"{test_score['MAE(명)']-before_test['MAE(명)']:+,.0f}명", delta_color="inverse")
st.caption(f"훈련 영화 {len(excluded)}편 제외 · 테스트 {len(test)}편은 그대로입니다. 후보를 선택하지 않으면 원래 모델을 유지합니다. 아래 예측과 카드는 이 재평가 모델을 사용합니다.")
if excluded:
    st.write("제외한 영화: " + ", ".join(candidate_names[code] for code in excluded))
st.caption("테스트 결과를 반복해서 보고 제외 대상을 고른 점수는 탐색 결과입니다. 실제 성능을 확정하려면 별도의 새 데이터로 다시 확인합니다.")

# STEP 7 — 최근 개봉작 선택과 PNG 리포트
from PIL import Image, ImageDraw, ImageFont


def report_png(movie, prediction, baseline, evaluation, asof, cols, excluded_count, font_bytes):
    """외부 포스터 없이 직접 그리는 1080×1350 공유 카드."""
    image = Image.new("RGB", (1080, 1350), "#10192b")
    draw = ImageDraw.Draw(image)
    ink, muted, accent = "#f7f4ed", "#bac4d7", "#d5ff67"
    def font(size):
        return ImageFont.truetype(BytesIO(font_bytes), size)
    def write(text, xy, size, color=ink):
        draw.text(xy, str(text), font=font(size), fill=color)
    def wrap(text, max_width, size):
        lines, line = [], ""
        for char in str(text):
            if draw.textlength(line + char, font=font(size)) > max_width and line:
                lines.append(line); line = char
            else:
                line += char
        if line:
            lines.append(line)
        return lines
    # 필름 프레임과 큰 활자. 제목은 줄바꿈해 긴 영화명도 담는다.
    draw.rounded_rectangle((42, 42, 1038, 1308), radius=26, outline="#3d4a62", width=2)
    draw.rounded_rectangle((72, 75, 385, 127), radius=26, fill=accent)
    write("NEXT SCENE / 07", (91, 86), 25, "#10192b")
    write(f"DATA {asof:%Y.%m.%d}", (720, 90), 24, muted)
    write("이 영화, 어디까지 갈까?", (76, 163), 39)
    title_size = 65
    while title_size > 24 and len(wrap(movie["movieNm"], 914, title_size)) > 3:
        title_size -= 2
    y = 231
    for line in wrap(movie["movieNm"], 914, title_size):
        write(line, (76, y), title_size)
        y += title_size + 12
    write(f"개봉 {movie['개봉일']:%Y.%m.%d}  ·  {movie['watchGrade']}", (77, 476), 25, muted)
    draw.line((76, 533, 1004, 533), fill="#3d4a62", width=2)
    write("관객 예측", (76, 571), 29, muted)
    number = f"{prediction / 10000:,.1f}만 명"
    size = 108
    while draw.textlength(number, font=font(size)) > 922 and size > 30:
        size -= 2
    write(number, (70, 626), size, accent)
    write("실제 집계가 아닌 모델의 추정", (77, 769), 26, muted)
    write(f"기본 속성 모델  {baseline / 10000:,.1f}만 명", (77, 828), 28)
    write(f"테스트 R²  {evaluation['R²']:.3f}", (77, 883), 28)
    write(f"테스트 MAE  {evaluation['MAE(명)'] / 10000:,.1f}만 명", (540, 883), 28)
    write(f"입력 {len(cols)}개 · 훈련 {excluded_count}편 제외 후 재평가", (77, 944), 25, muted)
    draw.line((76, 1004, 1004, 1004), fill="#3d4a62", width=2)
    write(f"첫 관측 {movie['첫 관측일']:%Y.%m.%d}  ·  카드 작성 {datetime.now(ZoneInfo('Asia/Seoul')):%Y.%m.%d}", (77, 1041), 24)
    notes = ["선택 영화는 학습·평가에서 제외한 학습용 예측입니다.",
             "과거 작품의 마지막 관측 누적관객을 학습했으며,", "최종 관객 수를 보장하지 않습니다.",
             "데이터: 영화진흥위원회 KOBIS · 정리: 모두의 데이터분석"]
    for i, line in enumerate(notes):
        write(line, (77, 1097 + i * 37), 23, muted)
    output = BytesIO()
    image.save(output, format="PNG")
    return output.getvalue()


st.header("4. 이 영화, 어디까지 갈까?")
st.caption("데이터 기준일로부터 최근 30일 안에 개봉했고, 필요한 속성이 있는 영화입니다. 박스오피스 10위권 관측 목록이므로 전체 개봉작 목록은 아닙니다.")
if recent.empty:
    st.info("최근 30일 안에 선택할 수 있는 영화가 없습니다. 데이터 갱신 후 다시 확인하세요.")
    st.stop()
by_code = recent.set_index("movieCd", drop=False)
selected = st.selectbox("최근 개봉작 선택", recent["movieCd"].tolist(), index=None, placeholder="영화 이름을 선택하세요",
                        format_func=lambda code: f"{by_code.loc[code, 'movieNm']} · {by_code.loc[code, '개봉일']:%Y.%m.%d}")
if selected is None:
    st.info("영화를 선택하면 입력 데이터와 예측 카드가 나타납니다.")
    st.stop()
movie = by_code.loc[selected]
mine = recent.loc[recent["movieCd"] == selected, cols]
prediction = float(model.predict(mine)[0])
base_model, _, _ = score(active_train, test, BASE)
baseline = float(base_model.predict(recent.loc[recent["movieCd"] == selected, BASE])[0])
st.subheader(movie["movieNm"])
st.caption(f"개봉일 {movie['개봉일']:%Y.%m.%d} · 입력의 첫 관측일 {movie['첫 관측일']:%Y.%m.%d} · 최근 관측일 {movie['마지막 관측일']:%Y.%m.%d}")
with st.expander("자동으로 불러온 입력 데이터", expanded=True):
    st.dataframe(pd.DataFrame({"속성": [LABELS[c] for c in cols], "값": [float(movie[c]) for c in cols]}), hide_index=True)
    st.caption(f"상영시간 {movie['showTm']:g}분 · 배우 {movie['actors_n']:g}명 · 주연 {movie['lead_n']:g}명 · {movie['watchGrade']} · {movie['company']}")
first, second = st.columns(2)
first.metric("선택 속성 모델의 관객 예측", f"{prediction:,.0f}명")
second.metric("기본 세 가지 모델의 관객 예측", f"{baseline:,.0f}명")
st.caption(f"참고 집계: {movie['마지막 관측일']:%Y.%m.%d}까지 {movie['관측 누적관객']:,.0f}명. 이 값은 입력에 넣지 않았습니다.")
outside = [LABELS[c] for c in cols if movie[c] < active_train[c].min() or movie[c] > active_train[c].max()]
if outside:
    st.warning("훈련 데이터 범위 밖의 입력: " + ", ".join(outside) + ". 이 영화는 공유 카드보다 입력과 가중치를 먼저 살펴보세요.")
if prediction < movie["관측 누적관객"] or prediction < 0 or baseline < 0:
    st.warning("예측이 이미 관측된 관객 수보다 작거나 음수입니다. 값을 임의로 올리지 않고 그대로 표시합니다. 이 경우 공유 카드 생성을 보류합니다.")
elif outside:
    st.info("학습 범위 밖의 예측이므로 공유 카드 생성을 보류했습니다.")
else:
    try:
        card = report_png(movie, prediction, baseline, test_score, asof, cols, len(excluded), fetch(FONT_URL))
        st.image(card, caption="1080 × 1350 PNG · 공유 전 예측 기준과 숫자를 확인하세요", width=540)
        st.download_button("예측 카드 PNG 저장", card, file_name=f"next-scene-{selected}-{asof:%Y%m%d}.png", mime="image/png", key="card-download")
    except Exception:
        st.warning("카드용 한글 글꼴을 불러오지 못했습니다. 예측값은 위에서 확인하고, 잠시 뒤 다시 카드 저장을 시도하세요.")
with st.expander("함께 올릴 설명"):
    caption = (f"이 영화, 어디까지 갈까? 🎬 {movie['movieNm']}\n"
               f"관객 예측 {prediction:,.0f}명 | 데이터 기준 {asof:%Y.%m.%d}\n"
               f"사용한 속성: {', '.join(LABELS[c] for c in cols)}\n"
               f"훈련 영화 {len(excluded)}편 제외 후 재평가 | 테스트 R² {test_score['R²']:.3f}\n"
               "실제 집계나 개봉 전 전망이 아닌, 개봉 후 관측 속성으로 만든 학습용 추정입니다.\n"
               "출처: 영화진흥위원회 KOBIS / 모두의 데이터분석\n#NEXTSCENE #데이터과학 #영화예측")
    st.code(caption, language=None)
    st.download_button("설명 TXT 저장", caption, file_name=f"next-scene-{selected}.txt", mime="text/plain")
