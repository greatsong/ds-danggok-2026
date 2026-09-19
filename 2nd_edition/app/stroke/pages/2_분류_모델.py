# pages/2_분류_모델.py — 속성을 골라 두 모델을 학습하고, 두 축으로 자른 자리를 그림으로 본다
import pandas as pd
import plotly.graph_objects as go
import streamlit as st
from sklearn.linear_model import LogisticRegression
from sklearn.preprocessing import StandardScaler
from sklearn.tree import DecisionTreeClassifier

st.set_page_config(page_title="분류 모델", page_icon="🤖", layout="wide")
st.title("🤖 분류 모델")
st.write("뇌졸중을 겪었는지 아닌지를 맞히는 모델 두 개를 만들고, 테스트 데이터로 정확도를 봅니다.")

데이터주소 = "https://raw.githubusercontent.com/greatsong/modudata/main/data/stroke.csv"
고를수있는열 = ["age", "avg_glucose_level", "bmi", "hypertension", "heart_disease"]
기본열 = ["age", "avg_glucose_level", "hypertension", "heart_disease"]
입력이름 = {"age": "나이", "avg_glucose_level": "평균 혈당", "bmi": "체질량지수",
            "hypertension": "고혈압", "heart_disease": "심장병"}
칸수 = 60
칸색 = ["#e2e8f0", "#fef3c7", "#dbeafe", "#dcfce7", "#fae8ff", "#ffe4e6", "#ede9fe", "#f8fafc"]


@st.cache_data
def 데이터_읽기():
    """번호 순으로 정렬해 둔다. 나누는 자리가 늘 같아야 점수를 비교할 수 있다."""
    return pd.read_csv(데이터주소, encoding="utf-8").sort_values("id").reset_index(drop=True)


정식이름 = {"확률로 답하는 모델": "로지스틱 회귀", "질문으로 답하는 모델": "의사결정트리"}


def 병기(이름):
    """교재에서 쓰는 이름 뒤에 교과서의 정식 이름을 괄호로 붙인다."""
    return f"{이름}({정식이름[이름]})" if 이름 in 정식이름 else 이름


def 우리말(열):
    return 입력이름[열]


df = 데이터_읽기()
고른열 = st.multiselect("입력으로 사용할 속성", 고를수있는열, default=기본열, format_func=우리말)
입력열 = [열 for 열 in 고를수있는열 if 열 in 고른열]   # 고른 차례와 상관없이 늘 같은 순서로 둔다
if len(입력열) < 2:
    st.warning("속성을 두 개 이상 골라 주세요. 하나만으로는 그림의 두 축을 만들 수 없습니다.")
    st.stop()

테스트용 = pd.Series(df.index % 10 < 3, index=df.index)   # 열 명 중 앞 세 명이 테스트용
X = df[입력열].copy()
y = df["stroke"]                                        # 1이면 뇌졸중, 0이면 아님. 뇌졸중이 양성이다
if "bmi" in 입력열 and X["bmi"].isna().any():
    중앙값 = float(X.loc[~테스트용, "bmi"].median())
    X["bmi"] = X["bmi"].fillna(중앙값)
    st.warning(f"체질량지수가 비어 있는 사람은 훈련용의 중앙값 {중앙값:.1f}으로 채웠습니다.")


def 학습(열들):
    """고른 열로 두 모델을 학습해 돌려준다. 설정은 늘 같다."""
    훈련 = X.loc[~테스트용, 열들]
    크기맞추기 = StandardScaler().fit(훈련)   # 크기 맞추기도 훈련용으로만 한다
    확률모델 = LogisticRegression(max_iter=2000).fit(크기맞추기.transform(훈련), y[~테스트용])
    # 질문으로 답하는 모델은 값의 크기에 영향받지 않으므로 크기를 맞추지 않은 값을 그대로 사용한다
    질문모델 = DecisionTreeClassifier(max_depth=3, min_samples_leaf=5, random_state=0).fit(훈련, y[~테스트용])
    return 크기맞추기, 확률모델, 질문모델


크기맞추기, 확률모델, 질문모델 = 학습(입력열)
많은쪽 = int(y[~테스트용].mode()[0])                       # 훈련용에서 사람이 많은 범주
실제 = y[테스트용].to_numpy()

st.info(f"훈련용 {int((~테스트용).sum()):,}명(그중 뇌졸중 {int(y[~테스트용].sum()):,}명)으로 학습하고, "
        f"테스트용 {int(테스트용.sum()):,}명(그중 실제 뇌졸중 {int(실제.sum()):,}명)으로 채점합니다.")

st.subheader("테스트 데이터에서의 정확도")
예측 = {"확률로 답하는 모델": 확률모델.predict(크기맞추기.transform(X[테스트용])),
        "질문으로 답하는 모델": 질문모델.predict(X[테스트용]),
        "한쪽으로만 답하는 모델": pd.Series(많은쪽, index=y[테스트용].index).to_numpy()}
칸들 = st.columns(3)
for 칸, (이름, 예측값) in zip(칸들, 예측.items()):
    칸.metric(병기(이름), f"{(예측값 == 실제).mean():.4f}")
st.caption("소수 넷째 자리까지 적었습니다. 맨 오른쪽은 입력을 하나도 보지 않고 훈련용에서 사람이 많은 쪽으로만 "
           "답하는 모델입니다. 세 값을 교재의 표에 적어 두세요.")

st.subheader("고른 속성 가운데 둘을 축으로 놓고 본다")
축칸 = st.columns(2)
가로 = 축칸[0].selectbox("가로축", 입력열, index=0, format_func=우리말)
세로후보 = [열 for 열 in 입력열 if 열 != 가로]
세로 = 축칸[1].selectbox("세로축", 세로후보, index=0, format_func=우리말)

채점입력 = X[테스트용]
# 두 축이 아닌 속성은 테스트 데이터의 중앙값에 세워 둔다. 위에서 채점한 그 모델을 그대로 그린다
고정값 = {열: float(채점입력[열].median()) for 열 in 입력열 if 열 not in (가로, 세로)}


def 눈금(열):
    """테스트용에서 가장 작은 값부터 가장 큰 값까지 고르게 나눈 값들을 돌려준다."""
    작은값, 큰값 = float(채점입력[열].min()), float(채점입력[열].max())
    큰값 = 큰값 if 큰값 > 작은값 else 작은값 + 1.0
    return [작은값 + (큰값 - 작은값) * i / (칸수 - 1) for i in range(칸수)]


def 두줄로(값들):   # 한 줄로 늘어선 값을 세로줄마다 잘라 표 모양으로 만든다
    return [값들[i * 칸수:(i + 1) * 칸수] for i in range(칸수)]


가로눈금, 세로눈금 = 눈금(가로), 눈금(세로)
격자 = pd.DataFrame([dict(고정값, **{가로: 가, 세로: 세}) for 세 in 세로눈금 for 가 in 가로눈금])[입력열]
확률격자 = 확률모델.predict_proba(크기맞추기.transform(격자))[:, 1].tolist()
마디번호 = 질문모델.apply(격자).tolist()              # 각 자리가 나무의 어느 마디에 떨어지는지
자리 = {마디: 번호 for 번호, 마디 in enumerate(sorted(set(마디번호)))}
마디수 = len(자리)
색단계 = [[(번호 + 끝) / 마디수, 칸색[번호 % len(칸색)]] for 번호 in range(마디수) for 끝 in (0, 1)]

그림 = go.Figure()
그림.add_trace(go.Heatmap(x=가로눈금, y=세로눈금, z=두줄로([자리[마디] for 마디 in 마디번호]),
                          colorscale=색단계, zmin=-0.5, zmax=마디수 - 0.5, opacity=0.45,
                          showscale=False, hoverinfo="skip"))
그림.add_trace(go.Contour(x=가로눈금, y=세로눈금, z=두줄로(확률격자),
                          contours=dict(coloring="lines", start=0.5, end=0.5, size=1),
                          line=dict(width=3, color="#2563eb"), showscale=False, hoverinfo="skip"))
점표 = pd.DataFrame({"가로": 채점입력[가로].to_numpy(), "세로": 채점입력[세로].to_numpy(),
                     "실제": pd.Series(실제).map({1: "뇌졸중 있음", 0: "뇌졸중 없음"}).to_numpy()})
for 이름, 색 in (("뇌졸중 없음", "#94a3b8"), ("뇌졸중 있음", "#7f1d1d")):
    한그룹 = 점표[점표["실제"] == 이름]
    그림.add_trace(go.Scatter(x=한그룹["가로"], y=한그룹["세로"], mode="markers", name=이름,
                              marker=dict(size=6, color=색, opacity=0.5)))
그림.update_layout(title=f"가로축 {우리말(가로)} · 세로축 {우리말(세로)}", xaxis_title=우리말(가로),
                   yaxis_title=우리말(세로), height=560)
st.plotly_chart(그림, width="stretch")
if not (min(확률격자) <= 0.5 <= max(확률격자)):
    st.info(f"이 그림 안에서 확률이 가장 높은 자리도 {max(확률격자):.2f}입니다. "
            f"이 그림에서는 0.5 경계선이 보이지 않습니다.")
고정설명 = " · ".join(f"{우리말(열)} {값:g}" for 열, 값 in 고정값.items())
st.caption("점은 테스트 데이터이고 색은 실제 뇌졸중 여부입니다. 파란 선은 확률로 답하는 모델이 0.5로 가르는 자리, "
           "옅은 색으로 나뉜 바탕은 질문으로 답하는 모델이 두 축을 나눈 칸입니다. 위에서 채점한 그 모델을 그렸습니다."
           + (f" 두 축이 아닌 속성은 테스트 데이터의 중앙값({고정설명})으로 고정해 계산했습니다." if 고정값 else ""))

st.subheader("질문으로 답하는 모델은 어떤 순서로 물었는가")


def 가지그림(모델, 열들):
    """학습한 나무를 가지가 갈라지는 그림으로 그린다.

    마디마다 그 자리에 온 훈련용 사람 수와 그중 실제 뇌졸중인 사람 수를 함께 적는다.
    더 묻지 않고 답을 내는 마디는 답에 따라 색을 달리한다.
    """
    나무 = 모델.tree_
    훈련 = X.loc[~테스트용, 열들]
    지난자리 = 모델.decision_path(훈련).toarray()      # 사람마다 지나간 마디에 1이 선다
    온사람 = 지난자리.sum(axis=0)
    뇌졸중 = 지난자리[y[~테스트용].to_numpy() == 1].sum(axis=0)

    줄 = ['digraph {', 'graph [ranksep=0.45 nodesep=0.28];',
          'node [shape=box style="filled,rounded" fontname="sans-serif" fontsize=13 '
          'color="#cbd5e1" penwidth=1.2 margin="0.18,0.10"];',
          'edge [fontname="sans-serif" fontsize=12 color="#94a3b8" fontcolor="#64748b"];']
    for 마디 in range(나무.node_count):
        인원 = int(온사람[마디])
        환자 = int(뇌졸중[마디])
        아래줄 = f"{인원:,}명\\n뇌졸중 {환자:,}명 · {환자 / 인원 * 100:.1f}%"
        if 나무.children_left[마디] == -1:              # 더 묻지 않고 답을 내는 마디
            답 = int(나무.value[마디][0].argmax())
            윗줄 = "답: 뇌졸중" if 답 else "답: 아님"
            칸색, 글자색 = ("#fecaca", "#7f1d1d") if 답 else ("#e2e8f0", "#334155")
        else:
            윗줄 = f"{입력이름[열들[나무.feature[마디]]]} ≤ {나무.threshold[마디]:.1f} ?"
            칸색, 글자색 = "#ffffff", "#1e293b"
        줄.append(f'{마디} [label="{윗줄}\n{아래줄}" fillcolor="{칸색}" fontcolor="{글자색}"];')
        for 자식, 딱지 in ((나무.children_left[마디], "예"), (나무.children_right[마디], "아니요")):
            if 자식 != -1:
                줄.append(f'{마디} -> {자식} [label=" {딱지} "];')
    return "\n".join(줄) + "\n}"


st.graphviz_chart(가지그림(질문모델, 입력열))

마지막마디 = [마디 for 마디 in range(질문모델.tree_.node_count)
              if 질문모델.tree_.children_left[마디] == -1]
아님마디 = sum(1 for 마디 in 마지막마디 if int(질문모델.tree_.value[마디][0].argmax()) == 0)
물은속성 = sorted({입력이름[입력열[열]] for 열 in 질문모델.tree_.feature if 열 >= 0})
st.caption(f"맨 위가 첫 질문입니다. 예라고 답하면 왼쪽, 아니요라고 답하면 오른쪽으로 내려갑니다. "
           f"색이 칠해진 마디가 더 묻지 않고 답을 내는 자리이고, 모두 {len(마지막마디)}개입니다. "
           f"그중 {아님마디}개가 아님이라고 답합니다.")
st.caption(f"고른 속성은 {len(입력열)}가지였지만 이 나무가 실제로 물은 것은 "
           f"{' · '.join(물은속성)} {len(물은속성)}가지입니다.")
