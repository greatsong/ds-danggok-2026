# main.py — 뇌졸중 예측 챌린지 (베타): 공개 순위판과 최종 순위판이 따로 있는 실습
import json

import numpy as np
import pandas as pd
import streamlit as st
from sklearn.ensemble import RandomForestClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.preprocessing import StandardScaler
from sklearn.tree import DecisionTreeClassifier

st.set_page_config(page_title="뇌졸중 예측 챌린지 (베타)", page_icon="🏁", layout="wide")
st.title("🏁 뇌졸중 예측 챌린지 · 베타")

데이터주소 = "https://raw.githubusercontent.com/greatsong/modudata/main/data/stroke.csv"
저장주소 = "https://upkakhnpvepqhsbwdyjb.supabase.co/rest/v1/challenge_beta"
공개키 = "sb_publishable_16HKdOESG_9U5OVNGZMeYQ_of--7oV1"
순위판주소 = "https://greatsong.github.io/ds-danggok-2026/challenge/beta.html"
정원 = 200
기본열 = ["age", "avg_glucose_level", "hypertension", "heart_disease"]


@st.cache_data
def 데이터_읽기():
    return pd.read_csv(데이터주소, encoding="utf-8").sort_values("id").reset_index(drop=True)


원본 = 데이터_읽기()
몫 = 원본.index % 10
훈련용, 공개용, 최종용 = 몫 <= 5, (몫 == 6) | (몫 == 7), 몫 >= 8
y = 원본["stroke"]

st.info(f"데이터를 셋으로 나눕니다. **훈련용 {int(훈련용.sum()):,}명**으로 배우고, "
        f"**공개 채점용 {int(공개용.sum()):,}명**으로 지금 순위를 매깁니다. "
        f"**최종 채점용 {int(최종용.sum()):,}명**의 점수는 수업 끝에 한 번만 공개합니다.")
st.caption(f"목표는 같습니다. 안내 인원이 상담 정원 {정원}명 이하인 채로 대상자를 가장 많이 찾아내는 것입니다. "
           f"공개 채점용에서 아무리 잘해도 최종 채점용에서 무너지면 소용이 없습니다.")

st.subheader("① 무엇을 보고 맞힐까")
칸1, 칸2 = st.columns(2)
파생목록 = {
    "체질량지수": "비어 있는 사람은 훈련용의 중앙값으로 채웁니다",
    "위험요인 개수": "고혈압·심장병·65세 이상·혈당 126 이상을 세어 0~4로 만듭니다",
    "나이 구간": "나이를 10년 단위로 묶습니다",
    "혈당 로그": "평균 혈당을 로그로 눌러 한쪽으로 쏠린 분포를 폅니다",
    "나이×혈당": "나이와 혈당을 곱해 둘이 함께 높은 사람을 드러냅니다",
}
고른파생 = []
for 번호, (이름, 설명) in enumerate(파생목록.items()):
    자리 = 칸1 if 번호 % 2 == 0 else 칸2
    if 자리.checkbox(이름, help=설명, key=f"파생{번호}"):
        고른파생.append(이름)
st.caption("나이 · 평균 혈당 · 고혈압 · 심장병 네 가지는 늘 사용합니다. 위에서 고른 것을 더 얹습니다.")


def 만들기():
    """고른 파생 변수까지 붙여 입력 표를 만든다."""
    d = 원본
    X = d[기본열].copy()
    if "체질량지수" in 고른파생:
        X["bmi"] = d["bmi"].fillna(float(d.loc[훈련용, "bmi"].median()))
    if "위험요인 개수" in 고른파생:
        X["위험요인수"] = (d["hypertension"] + d["heart_disease"]
                           + (d["age"] >= 65).astype(int) + (d["avg_glucose_level"] >= 126).astype(int))
    if "나이 구간" in 고른파생:
        X["나이구간"] = (d["age"] // 10).astype(int)
    if "혈당 로그" in 고른파생:
        X["혈당로그"] = np.log1p(d["avg_glucose_level"])
    if "나이×혈당" in 고른파생:
        X["나이x혈당"] = d["age"] * d["avg_glucose_level"] / 100
    return X


st.subheader("② 어떻게 답할까")
칸3, 칸4, 칸5 = st.columns(3)
모델이름 = 칸3.selectbox("모델", ["로지스틱 회귀", "의사결정트리", "랜덤 포레스트"])
가중치 = 칸4.toggle("양쪽의 가중치를 같게 맞추기", value=True)
if 모델이름 == "로지스틱 회귀":
    기준 = 칸5.slider("확률이 얼마를 넘으면 뇌졸중이라고 답할까요", 0.05, 0.60, 0.50, 0.05)
    깊이 = 0
else:
    깊이 = 칸5.slider("질문을 몇 번까지 던질까요", 1, 15, 3)
    기준 = st.slider("확률이 얼마를 넘으면 뇌졸중이라고 답할까요", 0.05, 0.60, 0.50, 0.05,
                     help="숲은 나무들의 평균 확률을 씁니다. 트리는 이 값을 쓰지 않습니다.") \
        if 모델이름 == "랜덤 포레스트" else 0.50


@st.cache_data(show_spinner="학습하는 중입니다")
def 학습과채점(파생, 모델이름, 가중치, 깊이, 기준):
    """설정 하나로 학습해 공개·최종 두 곳의 네 칸을 돌려준다."""
    X = 만들기()
    맞춤 = "balanced" if 가중치 else None
    Xtr, ytr = X[훈련용], y[훈련용]
    if 모델이름 == "로지스틱 회귀":
        맞추기 = StandardScaler().fit(Xtr)
        모델 = LogisticRegression(max_iter=3000, class_weight=맞춤).fit(맞추기.transform(Xtr), ytr)
        확률 = lambda 자리: 모델.predict_proba(맞추기.transform(X[자리]))[:, 1]
    elif 모델이름 == "의사결정트리":
        모델 = DecisionTreeClassifier(max_depth=깊이, min_samples_leaf=5, random_state=0,
                                      class_weight=맞춤).fit(Xtr, ytr)
        확률 = lambda 자리: 모델.predict_proba(X[자리])[:, 1]
    else:
        모델 = RandomForestClassifier(n_estimators=120, max_depth=깊이, min_samples_leaf=5,
                                      random_state=0, class_weight=맞춤, n_jobs=1).fit(Xtr, ytr)
        확률 = lambda 자리: 모델.predict_proba(X[자리])[:, 1]

    def 네칸(자리):
        예측 = (확률(자리) >= 기준).astype(int) if 모델이름 != "의사결정트리" else 모델.predict(X[자리])
        실제 = y[자리].to_numpy()
        TP = int(((실제 == 1) & (예측 == 1)).sum()); FP = int(((실제 == 0) & (예측 == 1)).sum())
        FN = int(((실제 == 1) & (예측 == 0)).sum()); TN = int(((실제 == 0) & (예측 == 0)).sum())
        return TP, FP, FN, TN

    return 네칸(공개용), 네칸(최종용)


def 지표(네칸):
    TP, FP, FN, TN = 네칸
    전체 = TP + FP + FN + TN
    정밀도 = TP / (TP + FP) if TP + FP else None
    재현율 = TP / (TP + FN) if TP + FN else None
    F1분모 = 2 * TP + FP + FN
    return {"정확도": (TP + TN) / 전체, "재현율": 재현율, "정밀도": 정밀도,
            "F1": (2 * TP / F1분모) if F1분모 else None,
            "찾아낸 환자": TP, "안내 인원": TP + FP}


공개칸, 최종칸 = 학습과채점(tuple(고른파생), 모델이름, 가중치, 깊이, 기준)
공개 = 지표(공개칸)
최종 = 지표(최종칸)                                   # 화면에는 보여 주지 않는다

st.subheader("③ 공개 채점 결과")
성적 = st.columns(4)
성적[0].metric("안내 인원", f"{공개['안내 인원']:,}명", f"정원 {정원}명")
성적[1].metric("정원 안에 드는가", "예" if 공개["안내 인원"] <= 정원 else "아니요")
성적[2].metric("찾아낸 대상자", f"{공개['찾아낸 환자']}명", f"전체 {int(y[공개용].sum())}명")
성적[3].metric("재현율", f"{공개['재현율']:.4f}" if 공개["재현율"] is not None else "—")


def 소수(값):
    return "계산할 수 없음" if 값 is None else f"{값:.4f}"


st.caption(f"네 지표 · 정확도 {소수(공개['정확도'])} · 재현율 {소수(공개['재현율'])} · "
           f"정밀도 {소수(공개['정밀도'])} · F1 {소수(공개['F1'])}")
st.warning("여기 보이는 것은 **공개 채점용 점수**입니다. 최종 채점용 점수는 수업 끝에 한 번만 공개합니다. "
           "공개 점수만 보고 설정을 계속 고치면, 공개 채점용에만 맞는 모델이 됩니다.")

st.divider()
st.subheader("📤 기록 올리기")
st.caption("이름과 학번은 받지 않습니다. 팀명과 반만 적습니다. 올릴 때 최종 채점용 점수도 함께 저장되지만 "
           "수업이 끝날 때까지 아무에게도 보이지 않습니다.")
칸6, 칸7, 칸8 = st.columns([1.2, 2, 2])
내반 = 칸6.selectbox("반", ["월수금반", "화수목반"])
내팀명 = 칸7.text_input("팀명", max_chars=12, placeholder="열두 글자까지")
보낼까 = 칸8.button("이 기록 올리기", width="stretch")

설정글 = (f"{모델이름} · 가중치 {'켬' if 가중치 else '끔'}"
          + (f" · 질문 {깊이}번" if 모델이름 != "로지스틱 회귀" else "")
          + (f" · 기준값 {기준:.2f}" if 모델이름 != "의사결정트리" else "")
          + (" · 더한 것 " + "·".join(고른파생) if 고른파생 else " · 기본 넷만"))
st.caption(f"지금 설정 — {설정글}")

지문 = (내반, 내팀명.strip(), tuple(고른파생), 모델이름, 가중치, 깊이, 기준)
if "베타올린것" not in st.session_state:
    st.session_state["베타올린것"] = []

if 보낼까 and not 내팀명.strip():
    st.warning("팀명을 적어 주세요.")
elif 보낼까 and 지문 in st.session_state["베타올린것"]:
    st.info("이미 올린 설정입니다. 설정을 바꾼 뒤에 다시 올려 주세요.")
elif 보낼까:
    보낼것 = {
        "class_id": 내반, "team_name": 내팀명.strip(),
        "model": 모델이름, "features": "·".join(고른파생) or "기본 넷만",
        "weighted": bool(가중치), "depth": int(깊이), "threshold": float(기준),
        "public_sent": 공개["안내 인원"], "public_found": 공개["찾아낸 환자"],
        "public_recall": None if 공개["재현율"] is None else round(공개["재현율"], 4),
        "public_f1": None if 공개["F1"] is None else round(공개["F1"], 4),
        "public_ok": bool(공개["안내 인원"] <= 정원),
        "final_sent": 최종["안내 인원"], "final_found": 최종["찾아낸 환자"],
        "final_recall": None if 최종["재현율"] is None else round(최종["재현율"], 4),
        "final_f1": None if 최종["F1"] is None else round(최종["F1"], 4),
        "final_ok": bool(최종["안내 인원"] <= 정원),
    }
    try:
        import js
        보내기 = js.XMLHttpRequest.new()
        보내기.open("POST", 저장주소, False)
        보내기.setRequestHeader("apikey", 공개키)
        보내기.setRequestHeader("Content-Type", "application/json")
        보내기.setRequestHeader("Prefer", "return=minimal")
        보내기.send(json.dumps(보낼것, ensure_ascii=False))
        if 보내기.status >= 300:
            raise RuntimeError(str(보내기.status))
        읽기 = js.XMLHttpRequest.new()
        읽기.open("GET", 저장주소 + "?select=class_id,team_name,public_found,public_ok", False)
        읽기.setRequestHeader("apikey", 공개키)
        읽기.send()
        줄들 = json.loads(읽기.responseText) if 읽기.status < 300 else []
    except ModuleNotFoundError:
        st.info("이 화면에서는 기록을 올릴 수 없습니다. 브라우저용 주소에서 올려 주세요.")
    except Exception as 오류:
        st.error(f"올리지 못했습니다. 잠시 뒤 다시 눌러 주세요. ({type(오류).__name__})")
    else:
        st.session_state["베타올린것"].append(지문)
        최고 = {}
        for r in 줄들:
            if not r.get("public_ok"):
                continue
            열쇠 = (r["class_id"], r["team_name"])
            최고[열쇠] = max(최고.get(열쇠, 0), int(r["public_found"]))
        내점수 = 최고.get((내반, 내팀명.strip()))
        if 내점수 is None:
            st.warning(f"안내 인원이 {공개['안내 인원']:,}명이라 정원 {정원}명을 넘겼습니다. "
                       f"기록은 남았지만 순위에는 들어가지 않습니다.")
        else:
            전체 = sorted(최고.values(), reverse=True)
            등수 = sum(1 for v in 전체 if v > 내점수) + 1
            st.success(f"### 공개 점수 {내점수}명!\n"
                       f"참가 {len(전체)}팀 가운데 **{등수}위** · 상위 {등수 / len(전체) * 100:.1f}%\n\n"
                       f"제출 {len(st.session_state['베타올린것'])}번째")
            if 등수 == 1:
                st.info("지금 공개 1위입니다. 최종 순위는 다를 수 있습니다.")

if st.session_state["베타올린것"]:
    st.caption(f"이번 시간에 올린 설정 {len(st.session_state['베타올린것'])}가지")
st.markdown(f"[📊 공개 순위판 열기]({순위판주소})")
