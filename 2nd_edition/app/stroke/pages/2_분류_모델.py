# pages/2_분류_모델.py — 속성을 골라 두 모델을 학습하고, 두 축으로 자른 자리를 그림으로 본다
import pandas as pd
import plotly.graph_objects as go
import streamlit as st
from sklearn.linear_model import LogisticRegression
from sklearn.preprocessing import StandardScaler
from sklearn.tree import DecisionTreeClassifier, export_text

st.set_page_config(page_title="분류 모델", page_icon="🤖", layout="wide")
st.title("🤖 분류 모델")
st.write("뇌졸중을 겪었는지 아닌지를 맞히는 모델 두 개를 만들고, 채점용 사람들로 정확도를 봅니다.")

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


def 우리말(열):
    return 입력이름[열]


df = 데이터_읽기()
고른열 = st.multiselect("입력으로 사용할 속성", 고를수있는열, default=기본열, format_func=우리말)
입력열 = [열 for 열 in 고를수있는열 if 열 in 고른열]   # 고른 차례와 상관없이 늘 같은 순서로 둔다
if len(입력열) < 2:
    st.warning("속성을 두 개 이상 골라 주세요. 하나만으로는 그림의 두 축을 만들 수 없습니다.")
    st.stop()

채점용 = pd.Series(df.index % 10 < 3, index=df.index)   # 열 명 중 앞 세 명이 채점용
X = df[입력열].copy()
y = df["stroke"]                                        # 1이면 뇌졸중, 0이면 아님. 뇌졸중이 양성이다
if "bmi" in 입력열 and X["bmi"].isna().any():
    중앙값 = float(X.loc[~채점용, "bmi"].median())
    X["bmi"] = X["bmi"].fillna(중앙값)
    st.warning(f"체질량지수가 비어 있는 사람은 훈련용의 중앙값 {중앙값:.1f}으로 채웠습니다.")


def 학습(열들):
    """고른 열로 두 모델을 학습해 돌려준다. 설정은 늘 같다."""
    훈련 = X.loc[~채점용, 열들]
    크기맞추기 = StandardScaler().fit(훈련)   # 크기 맞추기도 훈련용으로만 한다
    확률모델 = LogisticRegression(max_iter=2000).fit(크기맞추기.transform(훈련), y[~채점용])
    # 질문으로 답하는 모델은 값의 크기에 영향받지 않으므로 크기를 맞추지 않은 값을 그대로 사용한다
    질문모델 = DecisionTreeClassifier(max_depth=3, min_samples_leaf=5, random_state=0).fit(훈련, y[~채점용])
    return 크기맞추기, 확률모델, 질문모델


크기맞추기, 확률모델, 질문모델 = 학습(입력열)
많은쪽 = int(y[~채점용].mode()[0])                       # 훈련용에서 사람이 많은 범주
실제 = y[채점용].to_numpy()

st.info(f"훈련용 {int((~채점용).sum()):,}명(그중 뇌졸중 {int(y[~채점용].sum()):,}명)으로 학습하고, "
        f"채점용 {int(채점용.sum()):,}명(그중 실제 뇌졸중 {int(실제.sum()):,}명)으로 채점합니다.")

st.subheader("채점용 사람들에서의 정확도")
예측 = {"확률로 답하는 모델": 확률모델.predict(크기맞추기.transform(X[채점용])),
        "질문으로 답하는 모델": 질문모델.predict(X[채점용]),
        "한쪽으로만 답하는 모델": pd.Series(많은쪽, index=y[채점용].index).to_numpy()}
칸들 = st.columns(3)
for 칸, (이름, 예측값) in zip(칸들, 예측.items()):
    칸.metric(이름, f"{(예측값 == 실제).mean():.4f}")
st.caption("소수 넷째 자리까지 적었습니다. 맨 오른쪽은 입력을 하나도 보지 않고 훈련용에서 사람이 많은 쪽으로만 "
           "답하는 모델입니다. 세 값을 교재의 표에 적어 두세요.")

st.subheader("고른 속성 가운데 둘을 축으로 놓고 본다")
축칸 = st.columns(2)
가로 = 축칸[0].selectbox("가로축", 입력열, index=0, format_func=우리말)
세로후보 = [열 for 열 in 입력열 if 열 != 가로]
세로 = 축칸[1].selectbox("세로축", 세로후보, index=0, format_func=우리말)

두축 = [가로, 세로]
그림크기맞추기, 그림확률모델, 그림질문모델 = 학습(두축)   # 그림은 두 축만으로 다시 학습한 모델로 그린다
채점입력 = X[채점용]


def 눈금(열):
    """채점용에서 가장 작은 값부터 가장 큰 값까지 고르게 나눈 값들을 돌려준다."""
    작은값, 큰값 = float(채점입력[열].min()), float(채점입력[열].max())
    큰값 = 큰값 if 큰값 > 작은값 else 작은값 + 1.0
    return [작은값 + (큰값 - 작은값) * i / (칸수 - 1) for i in range(칸수)]


def 두줄로(값들):   # 한 줄로 늘어선 값을 세로줄마다 잘라 표 모양으로 만든다
    return [값들[i * 칸수:(i + 1) * 칸수] for i in range(칸수)]


가로눈금, 세로눈금 = 눈금(가로), 눈금(세로)
격자 = pd.DataFrame([{가로: 가, 세로: 세} for 세 in 세로눈금 for 가 in 가로눈금])[두축]
확률격자 = 그림확률모델.predict_proba(그림크기맞추기.transform(격자))[:, 1].tolist()
마디번호 = 그림질문모델.apply(격자).tolist()          # 각 자리가 트리의 어느 마디에 떨어지는지
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
st.caption("점은 채점용 사람들이고 색은 실제 뇌졸중 여부입니다. 파란 선은 확률로 답하는 모델이 0.5로 가르는 자리, "
           "옅은 색으로 나뉜 바탕은 질문으로 답하는 모델이 두 축을 나눈 칸입니다. 고른 두 축만으로 다시 학습한 그림입니다.")

st.subheader("질문으로 답하는 모델은 어떤 순서로 물었는가")
st.text(export_text(질문모델, feature_names=[입력이름[열] for 열 in 입력열]))
st.caption("맨 위가 첫 질문입니다. class가 1이면 뇌졸중, 0이면 아님이라고 답한 자리입니다.")
