# main.py — 뇌졸중 예측 실습실: 이 데이터가 무엇인지 소개하는 첫 화면
import json
from pathlib import Path

import pandas as pd
import streamlit as st

st.set_page_config(page_title="뇌졸중 예측 실습실", page_icon="🩺", layout="wide")
st.title("🩺 뇌졸중 예측 실습실")
st.write("건강 기록 5,110명분을 읽어 옵니다. 왼쪽 메뉴에서 페이지를 넘기며 들여다보고, 모델을 만들고, 채점합니다.")

데이터주소 = "https://raw.githubusercontent.com/greatsong/modudata/main/data/stroke.csv"


@st.cache_data
def 데이터_읽기():
    """UTF-8로 저장된 csv를 읽는다. bmi 열의 빈 값은 그대로 빈 값으로 남는다."""
    return pd.read_csv(데이터주소, encoding="utf-8")


df = 데이터_읽기()

저장파일 = Path("내_기록") / "데이터_소개.json"   # 적은 내용을 남겨 두어 새로고침해도 다시 불러온다


def 적어둔것_읽기():
    """전에 적어 둔 내용을 읽는다. 아직 없으면 빈 사전을 돌려준다."""
    try:
        return json.loads(저장파일.read_text(encoding="utf-8"))
    except (FileNotFoundError, ValueError):
        return {}


적어둔것 = 적어둔것_읽기()

st.subheader("한눈에 보기")
칸1, 칸2, 칸3, 칸4 = st.columns(4)
칸1.metric("전체 사람 수", f"{len(df):,}명")
칸2.metric("열 개수", f"{df.shape[1]}개")
칸3.metric("뇌졸중을 겪은 사람", f"{int(df['stroke'].sum()):,}명")
칸4.metric("그 비율", f"{df['stroke'].mean() * 100:.2f}%")

st.subheader("열마다 무엇이 들어 있는가")
st.caption("우리말 뜻 칸은 비어 있습니다. 교재의 열 대응표를 보고 직접 채워 넣으세요. "
           "적은 내용은 이 브라우저에 저장되어 새로고침해도 남습니다.")


def 값의_종류(열):
    """숫자 열은 가장 작은 값과 가장 큰 값을, 글자 열은 값의 가짓수와 실제 값을 적는다."""
    칸 = df[열].dropna()
    if pd.api.types.is_numeric_dtype(칸) and 칸.nunique() > 2:
        return f"숫자 {칸.min():g} ~ {칸.max():g}"
    값들 = sorted(칸.unique().astype(str))
    return f"{len(값들)}가지 · " + " · ".join(값들)


# 표를 그릴 때마다 바탕을 새로 만들면 고쳐 쓰던 칸이 지워지므로, 이 페이지를 열 때 한 번만 만든다
if "열설명표" not in st.session_state:
    적어둔뜻 = 적어둔것.get("우리말 뜻", {})
    st.session_state["열설명_바탕"] = pd.DataFrame({
        "열 이름": df.columns,
        "우리말 뜻": [적어둔뜻.get(열, "") for 열 in df.columns],
        "값의 종류": [값의_종류(열) for 열 in df.columns],
        "빈 값 개수": [int(df[열].isna().sum()) for 열 in df.columns],
    })
열설명 = st.session_state["열설명_바탕"]


def 저장하기():
    """우리말 뜻과 출처 칸에 적은 내용을 파일에 남긴다."""
    뜻 = dict(zip(열설명["열 이름"], 열설명["우리말 뜻"]))
    for 줄, 바뀐것 in st.session_state.get("열설명표", {}).get("edited_rows", {}).items():
        if "우리말 뜻" in 바뀐것:
            뜻[열설명["열 이름"][int(줄)]] = 바뀐것["우리말 뜻"] or ""
    저장파일.parent.mkdir(exist_ok=True)
    저장파일.write_text(json.dumps({"우리말 뜻": 뜻, "출처": st.session_state.get("출처", "")},
                                   ensure_ascii=False), encoding="utf-8")


st.data_editor(
    열설명,
    width="stretch",
    hide_index=True,
    disabled=["열 이름", "값의 종류", "빈 값 개수"],   # 우리말 뜻 칸만 고쳐 쓸 수 있다
    key="열설명표",
    on_change=저장하기,
)

st.subheader("앞 다섯 줄 그대로 보기")
st.dataframe(df.head(5), width="stretch", hide_index=True)

st.subheader("이 데이터는 어디서 왔는가")
출처_기본값 = """출처: 캐글 Stroke Prediction Dataset (게시자 fedesoriano, 2021-01-26 공개)
원본 주소: https://www.kaggle.com/datasets/fedesoriano/stroke-prediction-dataset
라이선스: Data files © Original Authors
게시자가 적은 문구: (Confidential Source) - Use only for educational purposes
이 수업에서는 교육 목적으로만 사용합니다."""
if "출처" not in st.session_state:
    st.session_state["출처"] = 적어둔것.get("출처", 출처_기본값)
st.text_area("교재를 보고 여기에 적습니다", height=170, key="출처", on_change=저장하기)
st.caption("이 데이터를 올린 사람은 원본 데이터가 어디서 왔는지 밝히지 않았고, 교육 목적으로만 사용하라고 적어 두었습니다. "
           "이름이나 생년월일이 없어 실제 환자를 찾아낼 수는 없지만, 출처를 알 수 없는 데이터로 얻은 결과를 "
           "실제 의학적 판단에 사용해서는 안 됩니다.")
