# pages/3_채점표.py — 네 칸으로 세고 네 지표로 채점한다
import pandas as pd
import streamlit as st
from sklearn.linear_model import LogisticRegression
from sklearn.preprocessing import StandardScaler
from sklearn.tree import DecisionTreeClassifier

st.set_page_config(page_title="채점표", page_icon="📋", layout="wide")
st.title("📋 채점표")
st.write("정확도 하나로는 알 수 없던 것을 네 칸으로 세어 봅니다.")

데이터주소 = "https://raw.githubusercontent.com/greatsong/modudata/main/data/stroke.csv"
입력열 = ["age", "avg_glucose_level", "hypertension", "heart_disease"]


@st.cache_data
def 데이터_읽기():
    return pd.read_csv(데이터주소, encoding="utf-8").sort_values("id").reset_index(drop=True)


df = 데이터_읽기()
채점용 = pd.Series(df.index % 10 < 3, index=df.index)   # '분류 모델' 페이지와 같은 방법으로 나눈다
X = df[입력열]
y = df["stroke"]

크기맞추기 = StandardScaler().fit(X[~채점용])
확률모델 = LogisticRegression(max_iter=2000).fit(크기맞추기.transform(X[~채점용]), y[~채점용])
질문모델 = DecisionTreeClassifier(max_depth=3, min_samples_leaf=5, random_state=0).fit(X[~채점용], y[~채점용])

많은쪽 = int(y[~채점용].mode()[0])
실제 = y[채점용].to_numpy()
예측 = {
    "확률로 답하는 모델": (확률모델.predict_proba(크기맞추기.transform(X[채점용]))[:, 1] >= 0.5).astype(int),
    "질문으로 답하는 모델": 질문모델.predict(X[채점용]),
    "한쪽으로만 답하는 모델": pd.Series(많은쪽, index=y[채점용].index).to_numpy(),
}

st.info(f"채점용은 {len(실제):,}명이고 그중 실제 뇌졸중은 {int(실제.sum()):,}명입니다.")


def 네칸(예측값):
    """행은 실제, 열은 예측. 네 칸의 사람 수를 센다."""
    TP = int(((실제 == 1) & (예측값 == 1)).sum())        # 뇌졸중을 뇌졸중이라 맞힌 사람 (찾아낸 환자)
    FN = int(((실제 == 1) & (예측값 == 0)).sum())        # 뇌졸중을 아니라고 놓친 사람 (놓친 환자)
    FP = int(((실제 == 0) & (예측값 == 1)).sum())        # 아닌데 뇌졸중이라 헛짚은 사람
    TN = int(((실제 == 0) & (예측값 == 0)).sum())        # 아닌 사람을 아니라고 맞힌 사람
    return TP, FN, FP, TN


def 혼동행렬표(TP, FN, FP, TN):
    표 = pd.DataFrame(
        [[f"{TP}명 (TP)", f"{FN}명 (FN)", f"{TP + FN}명"],
         [f"{FP}명 (FP)", f"{TN}명 (TN)", f"{FP + TN}명"],
         [f"{TP + FP}명", f"{FN + TN}명", f"{TP + FN + FP + TN}명"]],
        index=["실제 뇌졸중", "실제 아님", "열 합계"],
        columns=["뇌졸중이라 예측", "아니라고 예측", "행 합계"])
    표.index.name = "행 = 실제 · 열 = 예측"
    return 표


def 지표(TP, FN, FP, TN):
    """네 칸에서 네 지표를 구한다. 분모가 0이면 None을 돌려준다."""
    정확도 = (TP + TN) / (TP + FN + FP + TN)
    정밀도 = TP / (TP + FP) if (TP + FP) > 0 else None   # 분모는 뇌졸중이라 예측한 사람 수
    재현율 = TP / (TP + FN) if (TP + FN) > 0 else None   # 분모는 실제 뇌졸중인 사람 수
    F1_분모 = 2 * TP + FP + FN
    F1 = 2 * TP / F1_분모 if F1_분모 > 0 else None   # 정밀도를 구할 수 없어도 값이 나온다
    return 정확도, 정밀도, 재현율, F1


def 소수(값):
    return "계산할 수 없음" if 값 is None else f"{값:.4f}"


네칸값 = {이름: 네칸(예측값) for 이름, 예측값 in 예측.items()}

st.subheader("혼동행렬 · 네 칸으로 세기")
왼쪽, 오른쪽 = st.columns(2)
for 자리, 이름 in ((왼쪽, "확률로 답하는 모델"), (오른쪽, "질문으로 답하는 모델")):
    with 자리:
        st.markdown(f"**{이름}**")
        st.table(혼동행렬표(*네칸값[이름]))
st.caption("TP는 찾아낸 환자, FN은 놓친 환자, FP는 헛짚은 사람, TN은 아닌 사람을 아니라고 맞힌 사람입니다.")

st.subheader("네 칸에서 구한 네 지표")
줄 = []
for 이름 in 예측:
    TP, FN, FP, TN = 네칸값[이름]
    정확도, 정밀도, 재현율, F1 = 지표(TP, FN, FP, TN)
    줄.append({"모델": 이름, "TP (찾아낸 환자)": TP, "FP (헛짚은 사람)": FP,
               "FN (놓친 환자)": FN, "TN": TN, "정확도": 소수(정확도),
               "재현율": 소수(재현율), "정밀도": 소수(정밀도), "F1": 소수(F1)})
st.dataframe(pd.DataFrame(줄), width="stretch", hide_index=True)
st.caption("정확도의 분모는 채점용 전체 인원, 재현율의 분모는 실제 뇌졸중인 사람 수, "
           "정밀도의 분모는 뇌졸중이라 예측한 사람 수입니다. F1은 2 × TP ÷ (2 × TP + FP + FN)으로 구합니다. "
           "뇌졸중이라 예측한 사람이 0명이면 정밀도만 계산할 수 없고, F1은 0이 나옵니다.")

st.subheader("누구를 놓쳤고 누구를 헛짚었는가")
고른모델 = st.radio("어느 모델의 목록을 볼까요", list(예측), horizontal=True)
TP, FN, FP, TN = 네칸값[고른모델]
예측값 = 예측[고른모델]
채점명단 = df[채점용].copy()
채점명단["고혈압"] = 채점명단["hypertension"].map({1: "있음", 0: "없음"})
채점명단["심장병"] = 채점명단["heart_disease"].map({1: "있음", 0: "없음"})
보일열 = {"id": "번호", "age": "나이", "avg_glucose_level": "평균 혈당",
          "고혈압": "고혈압", "심장병": "심장병"}


def 목록(뽑을자리):
    골라낸 = 채점명단[뽑을자리].sort_values("age", ascending=False)
    return 골라낸[list(보일열)].rename(columns=보일열)


놓친환자 = 목록((실제 == 1) & (예측값 == 0))
헛짚은사람 = 목록((실제 == 0) & (예측값 == 1))
왼쪽, 오른쪽 = st.columns(2)
with 왼쪽:
    st.markdown(f"**놓친 환자 · 모두 {len(놓친환자):,}명**")
    st.dataframe(놓친환자.head(20), width="stretch", hide_index=True)
with 오른쪽:
    st.markdown(f"**헛짚은 사람 · 모두 {len(헛짚은사람):,}명**")
    st.dataframe(헛짚은사람.head(20), width="stretch", hide_index=True)
st.caption(f"나이가 많은 순서로 앞 스무 줄까지만 보여 줍니다. "
           f"놓친 환자 {len(놓친환자):,}명은 혼동행렬의 FN 칸과 같고, "
           f"헛짚은 사람 {len(헛짚은사람):,}명은 FP 칸과 같습니다.")
st.caption("이 목록에 있는 것은 번호뿐입니다. 누구인지 알 수 없고, 알 수 있어서도 안 됩니다.")
