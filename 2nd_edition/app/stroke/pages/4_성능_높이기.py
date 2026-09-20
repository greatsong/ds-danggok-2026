# pages/4_성능_높이기.py — 전후를 나란히 놓고 채점한 뒤, 설정을 바꿔 가며 최고 점수에 도전한다
import pandas as pd
import plotly.graph_objects as go
import streamlit as st
from sklearn.linear_model import LogisticRegression
from sklearn.preprocessing import StandardScaler
from sklearn.tree import DecisionTreeClassifier

st.set_page_config(page_title="성능 높이기", page_icon="🏆", layout="wide")
st.title("🏆 성능 높이기")
st.write("데이터를 손보고 다시 학습해 전후를 나란히 놓고 본 뒤, 설정을 바꿔 가며 더 좋은 점수에 도전합니다.")

데이터주소 = "https://raw.githubusercontent.com/greatsong/modudata/main/data/stroke.csv"
고를수있는열 = ["age", "avg_glucose_level", "bmi", "hypertension", "heart_disease"]
기본열 = ["age", "avg_glucose_level", "hypertension", "heart_disease"]
입력이름 = {"age": "나이", "avg_glucose_level": "평균 혈당", "bmi": "체질량지수",
            "hypertension": "고혈압", "heart_disease": "심장병"}
전이름, 후이름 = "고치기 전 (가중치 그대로)", "고친 뒤 (가중치를 같게)"
칸수 = 60
칸수3D = 26

@st.cache_data
def 데이터_읽기():
    return pd.read_csv(데이터주소, encoding="utf-8")

def 우리말(열):
    return 입력이름[열]

원본 = 데이터_읽기()

가중치맞추기 = st.toggle("양쪽의 가중치를 같게 맞추기", value=True,
                       help="뇌졸중을 겪은 사람이 아주 드무니, 학습할 때 양쪽의 가중치를 같게 맞춥니다.")
결측처리 = st.radio("체질량지수가 비어 있는 사람을 어떻게 할까요",
                    ["그대로 둔다", "지운다"], horizontal=True)
고른열 = st.multiselect("입력으로 사용할 속성", 고를수있는열, default=기본열, format_func=우리말,
                        help="처음에는 나이·평균 혈당·고혈압·심장병 네 가지가 골라져 있습니다.")
입력열 = [열 for 열 in 고를수있는열 if 열 in 고른열]   # 고른 차례와 상관없이 늘 같은 순서로 둔다
if len(입력열) < 2:
    st.warning("속성을 두 개 이상 골라 주세요. 하나만으로는 그림의 두 축을 만들 수 없습니다.")
    st.stop()

df = 원본 if 결측처리 == "그대로 둔다" else 원본.dropna(subset=["bmi"])
df = df.sort_values("id").reset_index(drop=True)        # '채점표' 페이지와 같은 방법으로 나눈다
테스트용 = pd.Series(df.index % 10 < 3, index=df.index)
X = df[입력열].copy()
y = df["stroke"]
실제 = y[테스트용].to_numpy()

if "bmi" in 입력열 and X["bmi"].isna().any():
    빈칸수 = int(X["bmi"].isna().sum())
    중앙값 = float(X.loc[~테스트용, "bmi"].median())
    X["bmi"] = X["bmi"].fillna(중앙값)
    st.warning(f"체질량지수가 비어 있는 {빈칸수:,}명은 훈련용의 중앙값 {중앙값:.1f}으로 채웠습니다.")

st.info(f"사용하는 사람은 {len(df):,}명이고 그중 뇌졸중은 {int(y.sum()):,}명입니다 · "
        f"테스트용 {len(실제):,}명 가운데 실제 뇌졸중은 {int(실제.sum()):,}명입니다.")
if 결측처리 == "지운다":
    st.warning(f"비어 있던 {len(원본) - len(df):,}명을 지웠습니다. "
               f"그 안에 뇌졸중 환자가 {int(원본['stroke'].sum() - y.sum()):,}명 들어 있었습니다.")

def 학습(가중치):
    """가중치를 맞출지 정해 두 모델을 학습해 돌려준다."""
    맞춤 = "balanced" if 가중치 else None
    크기맞추기 = StandardScaler().fit(X[~테스트용])
    확률모델 = LogisticRegression(max_iter=2000, class_weight=맞춤).fit(
        크기맞추기.transform(X[~테스트용]), y[~테스트용])
    질문모델 = DecisionTreeClassifier(max_depth=3, min_samples_leaf=5, random_state=0,
                                      class_weight=맞춤).fit(X[~테스트용], y[~테스트용])
    return 크기맞추기, 확률모델, 질문모델

모델 = {전이름: 학습(False), 후이름: 학습(True)}
예측 = {}
for 상태, (크기맞추기, 확률모델, 질문모델) in 모델.items():
    예측[상태] = {"확률로 답하는 모델": 확률모델.predict(크기맞추기.transform(X[테스트용])),
                  "질문으로 답하는 모델": 질문모델.predict(X[테스트용])}

def 네칸(실제값, 예측값):
    """테스트용뿐 아니라 훈련용도 셀 수 있도록 실제값을 함께 받는다."""
    TP = int(((실제값 == 1) & (예측값 == 1)).sum())
    FN = int(((실제값 == 1) & (예측값 == 0)).sum())
    FP = int(((실제값 == 0) & (예측값 == 1)).sum())
    TN = int(((실제값 == 0) & (예측값 == 0)).sum())
    return TP, FN, FP, TN

def 지표(TP, FN, FP, TN):
    정확도 = (TP + TN) / (TP + FN + FP + TN)
    정밀도 = TP / (TP + FP) if (TP + FP) > 0 else None
    재현율 = TP / (TP + FN) if (TP + FN) > 0 else None
    F1_분모 = 2 * TP + FP + FN
    F1 = 2 * TP / F1_분모 if F1_분모 > 0 else None   # 정밀도를 구할 수 없어도 값이 나온다
    return 정확도, 정밀도, 재현율, F1

정식이름 = {"확률로 답하는 모델": "로지스틱 회귀", "질문으로 답하는 모델": "의사결정트리"}

def 병기(이름):
    """교과서의 정식 이름을 앞에 두고 교재에서 쓰는 이름을 괄호로 붙인다."""
    return f"{정식이름[이름]}({이름})" if 이름 in 정식이름 else 이름

def 소수(값):
    return "계산할 수 없음" if 값 is None else f"{값:.4f}"

st.subheader("고치기 전과 고친 뒤")
for 모델이름 in ("확률로 답하는 모델", "질문으로 답하는 모델"):
    st.markdown(f"**{병기(모델이름)}**")
    칸 = {}
    for 상태 in 예측:
        TP, FN, FP, TN = 네칸(실제, 예측[상태][모델이름])
        정확도, 정밀도, 재현율, F1 = 지표(TP, FN, FP, TN)
        칸[상태] = [f"{TP}명", f"{FP}명", f"{FN}명", f"{TN:,}명",
                    소수(정확도), 소수(재현율), 소수(정밀도), 소수(F1)]
    비교표 = pd.DataFrame(칸, index=["TP (찾아낸 환자)", "FP (헛짚은 사람)", "FN (놓친 환자)", "TN",
                                     "정확도", "재현율", "정밀도", "F1"])
    비교표.index.name = ""
    st.table(비교표)
    전 = 네칸(실제, 예측[전이름][모델이름])
    후 = 네칸(실제, 예측[후이름][모델이름])
    st.caption(f"찾아낸 환자 {전[0]}명 → {후[0]}명 · 놓친 환자 {전[1]}명 → {후[1]}명 · "
               f"헛짚은 사람 {전[2]}명 → {후[2]}명")

st.subheader("가중치를 맞추자 경계선이 어디로 움직였는가")
축칸 = st.columns(2)
가로 = 축칸[0].selectbox("가로축", 입력열, index=0, format_func=우리말)
세로후보 = [열 for 열 in 입력열 if 열 != 가로]
세로 = 축칸[1].selectbox("세로축", 세로후보, index=0, format_func=우리말)

채점입력 = X[테스트용]
고정값 = {열: float(채점입력[열].median()) for 열 in 입력열 if 열 not in (가로, 세로)}
색깔 = {전이름: "#2563eb", 후이름: "#dc2626"}

def 눈금(열, 개수):
    """테스트용에서의 가장 작은 값부터 가장 큰 값까지 고르게 나눈 값들을 돌려준다."""
    작은값, 큰값 = float(채점입력[열].min()), float(채점입력[열].max())
    if 큰값 <= 작은값:
        큰값 = 작은값 + 1.0
    폭 = (큰값 - 작은값) / (개수 - 1)
    return [작은값 + 폭 * i for i in range(개수)]

def 두줄로(값들, 개수):
    """한 줄로 늘어선 값을 세로줄마다 잘라 표 모양으로 만든다."""
    return [값들[i * 개수:(i + 1) * 개수] for i in range(개수)]

가로눈금, 세로눈금 = 눈금(가로, 칸수), 눈금(세로, 칸수)
격자 = pd.DataFrame([dict(고정값, **{가로: 가, 세로: 세}) for 세 in 세로눈금 for 가 in 가로눈금])[입력열]

그림2D = go.Figure()
밖으로나간것 = []
for 상태 in (전이름, 후이름):
    크기맞추기, 확률모델, _ = 모델[상태]
    확률격자 = 확률모델.predict_proba(크기맞추기.transform(격자))[:, 1].tolist()
    그림2D.add_trace(go.Contour(x=가로눈금, y=세로눈금, z=두줄로(확률격자, 칸수),
                                contours=dict(coloring="lines", start=0.5, end=0.5, size=1),
                                line=dict(width=3, color=색깔[상태]), showscale=False,
                                hoverinfo="skip", name=f"{상태}의 0.5 경계선"))
    if not (min(확률격자) <= 0.5 <= max(확률격자)):
        밖으로나간것.append((상태, max(확률격자)))

점표 = pd.DataFrame({
    "가로": 채점입력[가로].to_numpy(), "세로": 채점입력[세로].to_numpy(),
    "실제": pd.Series(실제).map({1: "뇌졸중 있음", 0: "뇌졸중 없음"}).to_numpy(),
})
for 이름, 색 in (("뇌졸중 없음", "#94a3b8"), ("뇌졸중 있음", "#7f1d1d")):
    한그룹 = 점표[점표["실제"] == 이름]
    그림2D.add_trace(go.Scatter(x=한그룹["가로"], y=한그룹["세로"], mode="markers", name=이름,
                                marker=dict(size=6, color=색, opacity=0.5,
                                            line=dict(width=0.5, color="white"))))
그림2D.update_layout(title=f"가로축 {우리말(가로)} · 세로축 {우리말(세로)} · 전후 경계선",
                     xaxis_title=우리말(가로), yaxis_title=우리말(세로), height=560)
st.plotly_chart(그림2D, width="stretch")
for 상태, 가장높은확률 in 밖으로나간것:
    st.info(f"{상태}: 이 그림 안에서 확률이 가장 높은 자리도 {가장높은확률:.2f}입니다. "
            f"확률이 0.5를 넘는 자리가 없어 0.5 경계선이 그림 안에 없습니다.")
고정설명 = " · ".join(f"{우리말(열)} {값:g}" for 열, 값 in 고정값.items())
st.caption(f"파란 선은 고치기 전, 붉은 선은 고친 뒤의 0.5 경계선입니다. 점은 테스트 데이터이고 색은 실제 "
           f"뇌졸중 여부입니다."
           + (f" 두 축이 아닌 속성은 테스트 데이터의 중앙값({고정설명})으로 고정해 계산했습니다." if 고정값 else ""))

if len(입력열) >= 3:
    st.subheader("축 셋으로 돌려 보기")
    세축 = st.multiselect("3차원 산점도의 축 셋", 입력열, default=입력열[:3], max_selections=3,
                          format_func=우리말)
    if len(세축) != 3:
        st.info("축을 정확히 세 개 골라 주세요.")
    else:
        가1, 가2, 가3 = 세축
        자리 = {열: 번호 for 번호, 열 in enumerate(입력열)}
        눈금1, 눈금2 = 눈금(가1, 칸수3D), 눈금(가2, 칸수3D)
        낮은끝, 높은끝 = float(채점입력[가3].min()), float(채점입력[가3].max())
        그림3D = go.Figure()
        없는평면 = []
        for 상태 in (전이름, 후이름):
            크기맞추기, 확률모델, _ = 모델[상태]
            계수 = 확률모델.coef_[0].tolist()
            절편 = float(확률모델.intercept_[0])
            평균, 폭 = 크기맞추기.mean_.tolist(), 크기맞추기.scale_.tolist()

            def 크기맞춘값(열, 값, 계수=계수, 평균=평균, 폭=폭):
                i = 자리[열]
                return 계수[i] * (값 - 평균[i]) / 폭[i]

            세로3 = 자리[가3]
            평면 = None
            if 계수[세로3] != 0:
                남은값 = sum(크기맞춘값(열, float(채점입력[열].median()))
                             for 열 in 입력열 if 열 not in 세축)
                평면 = []
                for 값2 in 눈금2:
                    한줄 = []
                    for 값1 in 눈금1:
                        합 = 절편 + 남은값 + 크기맞춘값(가1, 값1) + 크기맞춘값(가2, 값2)
                        해 = 평균[세로3] - 폭[세로3] * 합 / 계수[세로3]
                        한줄.append(해 if 낮은끝 <= 해 <= 높은끝 else None)
                    평면.append(한줄)
                if all(값 is None for 한줄 in 평면 for 값 in 한줄):
                    평면 = None
            if 평면 is None:
                없는평면.append(상태)
            else:
                그림3D.add_trace(go.Surface(x=눈금1, y=눈금2, z=평면, showscale=False, opacity=0.45,
                                            colorscale=[[0, 색깔[상태]], [1, 색깔[상태]]],
                                            hoverinfo="skip", name=f"{상태}의 0.5 평면"))
        점표3 = pd.DataFrame({
            "축1": 채점입력[가1].to_numpy(), "축2": 채점입력[가2].to_numpy(),
            "축3": 채점입력[가3].to_numpy(),
            "실제": pd.Series(실제).map({1: "뇌졸중 있음", 0: "뇌졸중 없음"}).to_numpy(),
        })
        for 이름, 색 in (("뇌졸중 없음", "#94a3b8"), ("뇌졸중 있음", "#7f1d1d")):
            한그룹 = 점표3[점표3["실제"] == 이름]
            그림3D.add_trace(go.Scatter3d(x=한그룹["축1"], y=한그룹["축2"], z=한그룹["축3"],
                                          mode="markers", name=이름,
                                          marker=dict(size=3, color=색, opacity=0.6)))
        그림3D.update_layout(height=620, scene=dict(xaxis_title=우리말(가1), yaxis_title=우리말(가2),
                                                    zaxis_title=우리말(가3)))
        st.plotly_chart(그림3D, width="stretch")
        for 상태 in 없는평면:
            st.info(f"{상태}: 확률 0.5 평면이 이 그림 안에 없습니다. 그림 안의 어느 자리에서도 확률이 0.5에 "
                    f"닿지 않기 때문입니다.")
        st.caption("마우스로 끌면 돌려 볼 수 있습니다. 파란 면은 고치기 전, 붉은 면은 고친 뒤의 0.5 평면입니다."
                   + (" 축 셋이 아닌 속성은 테스트 데이터의 중앙값으로 고정해 계산했습니다." if len(입력열) > 3 else ""))

상태이름 = 후이름 if 가중치맞추기 else 전이름
st.subheader(f"{상태이름} · {병기('확률로 답하는 모델')}이 놓친 환자")
예측값 = 예측[상태이름]["확률로 답하는 모델"]
채점명단 = df[테스트용].copy()
채점명단["고혈압"] = 채점명단["hypertension"].map({1: "있음", 0: "없음"})
채점명단["심장병"] = 채점명단["heart_disease"].map({1: "있음", 0: "없음"})
놓친환자 = 채점명단[(실제 == 1) & (예측값 == 0)].sort_values("age")
놓친환자 = 놓친환자[["id", "age", "고혈압", "심장병"]].rename(columns={"id": "번호", "age": "나이"})
st.markdown(f"**모두 {len(놓친환자):,}명**")
st.dataframe(놓친환자.head(20), width="stretch", hide_index=True)
st.caption("나이가 적은 순서로 앞 스무 줄까지만 보여 줍니다. 고혈압 칸과 심장병 칸을 함께 읽어 보세요.")

st.divider()
st.subheader("🏆 챌린지 — 상담 안내 대상을 가장 잘 고르는 설정 찾기")
st.info("목표 · 안내 인원이 상담 정원 500명 이하인 채로, 찾아낸 환자를 가장 많이 만듭니다. "
        "테스트 데이터로 채점합니다. 위의 입력 속성과 빈 값 처리도 함께 바꿔 보세요.")
st.caption("기본 설정은 11차시에서 사용한 것과 같습니다. 가중치 그대로 · 질문 3번 · 기준값 0.50. "
           f"기준값은 {병기('확률로 답하는 모델')}에만 적용됩니다.")
조절1, 조절2, 조절3 = st.columns(3)
내가중치 = 조절1.toggle("양쪽의 가중치를 같게 맞추기", value=True, key="실험가중치")
내깊이 = 조절2.slider("질문을 몇 번까지 던질까요", 1, 10, 3)
내기준 = 조절3.slider("확률이 얼마를 넘으면 뇌졸중이라고 답할까요", 0.05, 0.50, 0.50, 0.05)
정원 = 500


def 실험학습(가중치, 깊이):
    """가중치와 질문 횟수를 정해 두 모델을 학습한다."""
    맞춤 = "balanced" if 가중치 else None
    크기맞추기 = StandardScaler().fit(X[~테스트용])
    확률모델 = LogisticRegression(max_iter=2000, class_weight=맞춤).fit(
        크기맞추기.transform(X[~테스트용]), y[~테스트용])
    질문모델 = DecisionTreeClassifier(max_depth=깊이, min_samples_leaf=5, random_state=0,
                                      class_weight=맞춤).fit(X[~테스트용], y[~테스트용])
    return 크기맞추기, 확률모델, 질문모델


def 채점(모델이름, 설정, 자리):
    """한 설정으로 학습해 그 자리(훈련용 또는 테스트용)의 네 칸과 네 지표를 돌려준다."""
    가중치, 깊이, 기준 = 설정
    크기맞추기, 확률모델, 질문모델 = 실험학습(가중치, 깊이)
    if 모델이름 == "확률로 답하는 모델":
        확률 = 확률모델.predict_proba(크기맞추기.transform(X[자리]))[:, 1]
        예측값 = (확률 >= 기준).astype(int)
    else:
        예측값 = 질문모델.predict(X[자리])
    TP, FN, FP, TN = 네칸(y[자리].to_numpy(), 예측값)
    return (TP, FN, FP, TN) + 지표(TP, FN, FP, TN)


기본설정 = (False, 3, 0.50)
내설정 = (내가중치, 내깊이, 내기준)

st.markdown("**지금 내 설정의 성적** · 테스트 데이터 기준")
성적칸 = st.columns(4)
내기록 = {}
for 자리번호, 모델이름 in enumerate(("확률로 답하는 모델", "질문으로 답하는 모델")):
    TP, FN, FP, TN, 정확도, 정밀도, 재현율, F1 = 채점(모델이름, 내설정, 테스트용)
    내기록[모델이름] = {"찾아낸 환자": TP, "안내 인원": TP + FP,
                        "정확도": 정확도, "재현율": 재현율, "정밀도": 정밀도, "F1": F1}
성적 = max(내기록.items(), key=lambda x: (x[1]["안내 인원"] <= 정원, x[1]["찾아낸 환자"]))
좋은모델, 값 = 성적
성적칸[0].metric("안내 인원", f"{값['안내 인원']:,}명", f"정원 {정원}명")
성적칸[1].metric("정원 안에 드는가", "예" if 값["안내 인원"] <= 정원 else "아니요")
성적칸[2].metric("찾아낸 환자", f"{값['찾아낸 환자']}명", f"전체 대상자 {int(y[테스트용].sum())}명")
성적칸[3].metric("재현율", f"{값['재현율']:.4f}" if 값["재현율"] is not None else "—")
st.caption(f"네 지표 · 정확도 {소수(값['정확도'])} · 재현율 {소수(값['재현율'])} · "
           f"정밀도 {소수(값['정밀도'])} · F1 {소수(값['F1'])}")
st.caption(f"두 모델 가운데 조건을 채우면서 더 많이 찾아낸 쪽인 {병기(좋은모델)}의 성적입니다. "
           f"정원을 넘기면 아무리 많이 찾아내도 기록으로 치지 않습니다.")

if "최고기록" not in st.session_state:
    st.session_state["최고기록"] = None
if 값["안내 인원"] <= 정원:
    이전 = st.session_state["최고기록"]
    if 이전 is None or 값["찾아낸 환자"] > 이전["찾아낸 환자"]:
        st.session_state["최고기록"] = {"찾아낸 환자": 값["찾아낸 환자"], "안내 인원": 값["안내 인원"],
                                        "모델": 좋은모델, "가중치": 내가중치, "깊이": 내깊이,
                                        "기준값": 내기준, "입력": [우리말(열) for 열 in 입력열],
                                        "빈 값": 결측처리}
최고 = st.session_state["최고기록"]
if 최고:
    st.success(f"지금까지 내 최고 기록 · 찾아낸 환자 {최고['찾아낸 환자']}명 (안내 {최고['안내 인원']:,}명) · "
               f"{병기(최고['모델'])} · 입력 {' · '.join(최고['입력'])} · 빈 값 {최고['빈 값']} · "
               f"가중치 {'켬' if 최고['가중치'] else '끔'} · 질문 {최고['깊이']}번 · 기준값 {최고['기준값']:.2f}")
    st.caption("이 기록을 모델 소개 페이지에 옮겨 적습니다. 화면을 닫으면 기록은 사라집니다.")
else:
    st.warning("아직 정원 안에 든 기록이 없습니다. 안내 인원을 500명 이하로 만들어 보세요.")

st.markdown("**기본 설정과 내 설정 · 훈련용과 테스트용**")
설정 = {"기본 설정": 기본설정, "내 설정": 내설정}
쓰임 = {"훈련용": ~테스트용, "테스트용": 테스트용}
for 모델이름 in ("확률로 답하는 모델", "질문으로 답하는 모델"):
    st.markdown(f"**{병기(모델이름)}**")
    칸 = {}
    for 설정이름, 그설정 in 설정.items():
        for 쓰임이름, 자리 in 쓰임.items():
            TP, FN, FP, TN, 정확도, 정밀도, 재현율, F1 = 채점(모델이름, 그설정, 자리)
            칸[f"{설정이름} · {쓰임이름}"] = [소수(정확도), 소수(재현율), 소수(정밀도), 소수(F1),
                                              f"{TP}명", f"{FP}명"]
    실험표 = pd.DataFrame(칸, index=["정확도", "재현율", "정밀도", "F1",
                                     "찾아낸 환자 (TP)", "헛짚은 사람 (FP)"])
    실험표.index.name = ""
    st.table(실험표)

달라진것 = []
if 내가중치:
    달라진것.append("양쪽의 가중치를 같게 맞췄습니다")
if 내깊이 != 3:
    달라진것.append(f"질문 횟수를 3번에서 {내깊이}번으로 바꿨습니다")
if 내기준 != 0.50:
    달라진것.append(f"기준값을 0.50에서 {내기준:.2f}로 바꿨습니다")
if 입력열 != 기본열:
    달라진것.append("입력 속성을 바꿨습니다")
if 결측처리 != "그대로 둔다":
    달라진것.append("빈 값이 있는 기록을 지웠습니다")
st.caption("기본 설정에서 달라진 것: "
           + (" · ".join(달라진것) if 달라진것 else "없습니다. 조절 자리를 움직여 보세요."))
st.caption("훈련용은 학습에 사용한 사람들이고 테스트용은 사용하지 않은 사람들입니다. "
           "질문 횟수를 늘리면 두 점수가 어떻게 벌어지는지 보세요. "
           "훈련용에서만 잘 맞히는 모델은 처음 보는 사람에게는 쓸 수 없습니다.")


st.divider()
st.subheader("📤 기록 올리기")
st.caption("이름과 학번은 받지 않습니다. 팀명과 반만 적습니다. "
           "올릴 만한 기록이 나왔을 때 버튼을 누릅니다. 같은 설정은 한 번만 올라갑니다.")
저장주소 = "https://upkakhnpvepqhsbwdyjb.supabase.co/rest/v1/challenge_log"
공개키 = "sb_publishable_16HKdOESG_9U5OVNGZMeYQ_of--7oV1"
순위판주소 = "https://greatsong.github.io/ds-danggok-2026/challenge/"

칸1, 칸2, 칸3 = st.columns([1.2, 2, 2])
내반 = 칸1.selectbox("반", ["월수금반", "화수목반"])
내팀명 = 칸2.text_input("팀명", max_chars=12, placeholder="열두 글자까지")
보낼까 = 칸3.button("이 기록 올리기", width="stretch")

def 올리기(보낼것):
    """기록을 보내고, 방금 올린 것까지 넣어 순위를 다시 센다. 브라우저에서만 동작한다."""
    import json

    import js                                           # 브라우저에서 실행할 때만 있다
    보내기 = js.XMLHttpRequest.new()
    보내기.open("POST", 저장주소, False)                 # False는 다 보낼 때까지 기다린다는 뜻
    보내기.setRequestHeader("apikey", 공개키)
    보내기.setRequestHeader("Content-Type", "application/json")
    보내기.setRequestHeader("Prefer", "return=minimal")
    보내기.send(json.dumps(보낼것, ensure_ascii=False))
    if 보내기.status >= 300:
        raise RuntimeError(f"보내기 실패 {보내기.status}")

    읽기 = js.XMLHttpRequest.new()
    읽기.open("GET", 저장주소 + "?select=class_id,nickname,found,within_quota", False)
    읽기.setRequestHeader("apikey", 공개키)
    읽기.send()
    return json.loads(읽기.responseText) if 읽기.status < 300 else []


def 순위세기(줄들, 반, 팀명):
    """정원 안에 든 기록만 가지고 팀별 최고를 구해 우리 자리를 센다."""
    최고 = {}
    for r in 줄들:
        if not r.get("within_quota"):
            continue
        열쇠 = (r["class_id"], r["nickname"])
        최고[열쇠] = max(최고.get(열쇠, 0), int(r["found"]))
    내점수 = 최고.get((반, 팀명))
    if 내점수 is None:
        return None
    전체 = sorted(최고.values(), reverse=True)
    우리반 = sorted(v for (c, _), v in 최고.items() if c == 반)
    return {
        "내점수": 내점수,
        "전체인원": len(전체), "전체등수": sum(1 for v in 전체 if v > 내점수) + 1,
        "반인원": len(우리반), "반등수": sum(1 for v in 우리반 if v > 내점수) + 1,
    }


지문 = (내반, 내팀명.strip(), 결측처리, tuple(입력열), 내가중치, 내깊이, 내기준)
if "올린것" not in st.session_state:
    st.session_state["올린것"] = set()

if 보낼까 and not 내팀명.strip():
    st.warning("팀명을 적어 주세요.")
elif 보낼까 and 지문 in st.session_state["올린것"]:
    st.info("이미 올린 설정입니다. 설정을 바꾼 뒤에 다시 올려 주세요.")
elif 보낼까:
    보낼것 = {
        "class_id": 내반, "nickname": 내팀명.strip(),
        "model": 정식이름.get(좋은모델, 좋은모델), "inputs": " · ".join(우리말(열) for 열 in 입력열),
        "missing": 결측처리, "weighted": bool(내가중치),
        "depth": int(내깊이), "threshold": float(내기준),
        "sent": int(값["안내 인원"]), "found": int(값["찾아낸 환자"]),
        "accuracy": round(float(값["정확도"]), 4),
        "recall": None if 값["재현율"] is None else round(float(값["재현율"]), 4),
        "precision": None if 값["정밀도"] is None else round(float(값["정밀도"]), 4),
        "f1": None if 값["F1"] is None else round(float(값["F1"]), 4),
        "within_quota": bool(값["안내 인원"] <= 정원),
    }
    try:
        줄들 = 올리기(보낼것)
    except ModuleNotFoundError:
        st.info("이 화면에서는 기록을 올릴 수 없습니다. 브라우저용 실습실 주소에서 올려 주세요.")
    except Exception as 오류:
        st.error(f"올리지 못했습니다. 잠시 뒤 다시 눌러 주세요. ({type(오류).__name__})")
    else:
        st.session_state["올린것"].add(지문)
        자리 = 순위세기(줄들, 내반, 내팀명.strip())
        if 자리 is None:
            st.warning(f"안내 인원이 {보낼것['sent']:,}명이라 정원 {정원}명을 넘겼습니다. "
                       f"기록은 남았지만 순위에는 들어가지 않습니다. 안내 인원을 줄여 보세요.")
        else:
            위쪽 = 자리["전체등수"] / 자리["전체인원"] * 100
            st.success(f"### 찾아낸 환자 {자리['내점수']}명!\n"
                       f"참가 {자리['전체인원']}팀 가운데 **{자리['전체등수']}위** · 상위 {위쪽:.1f}%\n\n"
                       f"{내반} 안에서는 {자리['반인원']}팀 가운데 **{자리['반등수']}위**")
            if 자리["전체등수"] == 1:
                st.info("지금 1위입니다.")
            if 자리["내점수"] > 67:
                st.info("수업 기본 설정의 67명을 넘겼습니다.")
                st.balloons()

st.markdown(f"[📊 우리 반 순위판 열기]({순위판주소})")
