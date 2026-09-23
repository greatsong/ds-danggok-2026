# pages/5_내가_만든_모델_소개.py — 최고 기록과 처음 설정에서 바꾼 것을 보여 주고, 왜 결과가 달라졌는지 적는다
import json
from pathlib import Path
from urllib.parse import quote

import pandas as pd
import streamlit as st

st.set_page_config(page_title="내가 만든 모델 소개", page_icon="📝", layout="wide")
st.title("📝 내가 만든 모델 소개")
st.write("최고 기록과 처음 설정에서 바꾼 것은 성능 높이기 페이지에서 그대로 가져옵니다. "
         "바꾼 것이 왜 결과를 바꾸었는지만 직접 적습니다. "
         "적은 내용은 이 브라우저에 저장되어 새로고침해도 남습니다. 다 적은 뒤 맨 아래의 제출하기를 누릅니다.")

기록폴더 = Path("내_기록")
최고기록파일 = 기록폴더 / "최고_기록.json"     # 성능 높이기 페이지가 적어 둔다
소개파일 = 기록폴더 / "모델_소개.json"

# 클래스룸 과제에 붙인 구글 폼의 미리 채운 주소. __RECORD__ 같은 자리에 내 기록이 들어간다
제출주소 = ("https://docs.google.com/forms/d/e/1FAIpQLSdoJSLr-Jc5lm89Fvi5_1Rp6wEdMWDp8rfnBvaoYtsJenCHQw/viewform"
            "?usp=pp_url&entry.190918525=__RECORD__&entry.1289539943=__SETTING__"
            "&entry.624953769=__CHANGED__&entry.1133731976=__REASON__")

# 성능 높이기 페이지의 챌린지가 처음 열릴 때의 설정과 그때의 결과
처음설정 = {"입력": ["나이", "평균 혈당", "고혈압", "심장병"], "빈 값": "그대로 둔다",
            "가중치": True, "깊이": 3, "기준값": 0.60}
처음결과 = {"찾아낸 환자": 60, "안내 인원": 358}


def 읽기(파일):
    """파일에 적어 둔 내용을 읽는다. 아직 없으면 None을 돌려준다."""
    try:
        return json.loads(파일.read_text(encoding="utf-8"))
    except (FileNotFoundError, ValueError):
        return None


def 저장하기():
    """내 생각 칸에 적은 내용을 파일에 남긴다."""
    기록폴더.mkdir(exist_ok=True)
    소개파일.write_text(json.dumps({"방법": st.session_state["방법"]}, ensure_ascii=False),
                        encoding="utf-8")


def 을를(말):
    """마지막 글자에 받침이 있으면 '을', 없으면 '를'을 붙인다."""
    끝 = ord(말[-1]) - 0xAC00
    return 말 + ("을" if 0 <= 끝 < 11172 and 끝 % 28 else "를")


def 바꾼것(최고):
    """처음 설정과 최고 기록의 설정을 비교해 달라진 것을 문장으로 돌려준다."""
    문장 = []
    더한것 = [x for x in 최고["입력"] if x not in 처음설정["입력"]]
    뺀것 = [x for x in 처음설정["입력"] if x not in 최고["입력"]]
    if 더한것:
        문장.append(f"입력 속성에 {을를(' · '.join(더한것))} 더했습니다.")
    if 뺀것:
        문장.append(f"입력 속성에서 {을를(' · '.join(뺀것))} 뺐습니다.")
    if 최고["빈 값"] != 처음설정["빈 값"]:
        문장.append("체질량지수가 비어 있는 사람을 지웠습니다.")
    if 최고["가중치"] != 처음설정["가중치"]:
        문장.append("양쪽의 가중치를 같게 맞추지 않고 그대로 두었습니다.")
    if 최고["모델"] != "확률로 답하는 모델" and 최고["깊이"] != 처음설정["깊이"]:
        문장.append(f"질문 횟수를 {처음설정['깊이']}번에서 {최고['깊이']}번으로 바꿨습니다.")
    if round(최고["기준값"], 2) != 처음설정["기준값"]:
        문장.append(f"기준값을 {처음설정['기준값']:.2f}에서 {최고['기준값']:.2f}로 바꿨습니다.")
    return 문장


def 소수(값):
    return "계산할 수 없음" if 값 is None else f"{값:.4f}"


st.subheader("내 최고 기록")
최고 = st.session_state.get("최고기록") or 읽기(최고기록파일)
if 최고 is None:
    st.warning("아직 기록이 없습니다. 성능 높이기 페이지에서 안내 인원이 500명 이하인 설정을 먼저 찾습니다.")
else:
    모델이름 = "로지스틱 회귀" if 최고["모델"] == "확률로 답하는 모델" else "의사결정트리"
    칸 = st.columns(3)
    칸[0].metric("찾아낸 환자", f"{최고['찾아낸 환자']}명")
    칸[1].metric("안내 인원", f"{최고['안내 인원']:,}명")
    칸[2].metric("모델", 모델이름)
    설정표 = pd.DataFrame({
        "설정": ["입력 속성", "빈 값", "가중치", "질문 횟수", "기준값"],
        "값": [" · ".join(최고["입력"]), 최고["빈 값"], "같게 맞춤" if 최고["가중치"] else "그대로",
               f"{최고['깊이']}번" if 최고["모델"] != "확률로 답하는 모델" else "— (트리에만 적용)",
               f"{최고['기준값']:.2f}"],
    })
    st.table(설정표.set_index("설정"))
    if "재현율" in 최고:
        st.caption(f"테스트 데이터 기준 · 정확도 {소수(최고['정확도'])} · 재현율 {소수(최고['재현율'])} · "
                   f"정밀도 {소수(최고['정밀도'])} · F1 {소수(최고['F1'])}")

    st.subheader("처음 설정에서 바꾼 것")
    st.markdown(f"처음 설정의 결과는 찾아낸 환자 {처음결과['찾아낸 환자']}명 · 안내 {처음결과['안내 인원']}명이었습니다. "
                f"최고 기록은 찾아낸 환자 {최고['찾아낸 환자']}명 · 안내 {최고['안내 인원']:,}명입니다.")
    for 한줄 in 바꾼것(최고) or ["처음 설정에서 바꾼 것이 없습니다."]:
        st.markdown(f"- {한줄}")

    st.subheader("바꾼 것이 왜 결과를 바꾸었다고 생각합니까")
    st.caption("위에서 바꾼 것 가운데 하나 이상을 골라, 그것 때문에 모델이 누구를 뇌졸중이라고 답하게 되었는지 적습니다. "
               "찾아낸 환자와 안내 인원이 어떻게 달라졌는지도 함께 적습니다.")
    if "방법" not in st.session_state:
        st.session_state["방법"] = (읽기(소개파일) or {}).get("방법", "")
    st.text_area("내 생각", key="방법", height=200, on_change=저장하기,
                 placeholder="예) ○○을 바꾸자 모델이 △△인 사람도 뇌졸중이라고 답하게 되었다. 그래서 …")

    st.subheader("제출하기")
    if not 제출주소:
        st.info("선생님이 제출 폼을 연결하면 여기에 제출 버튼이 나타납니다. 그 전에는 화면을 갈무리해 제출합니다.")
    elif st.button("제출할 내용 확인하기", type="primary"):
        내생각 = st.session_state["방법"].strip()
        if not 내생각:
            st.warning("내 생각 칸을 먼저 채웁니다.")
        else:
            저장하기()
            채울것 = {
                "__RECORD__": f"찾아낸 환자 {최고['찾아낸 환자']}명 · 안내 {최고['안내 인원']:,}명 · {모델이름}",
                "__SETTING__": " · ".join(f"{설정} {값}" for 설정, 값 in zip(설정표["설정"], 설정표["값"])),
                "__CHANGED__": "\n".join(바꾼것(최고)) or "처음 설정에서 바꾼 것이 없습니다.",
                "__REASON__": 내생각,
            }
            주소 = 제출주소
            for 자리, 값 in 채울것.items():
                주소 = 주소.replace(자리, quote(값))
            st.success("아래 버튼을 누르면 내용이 채워진 제출 폼이 새 탭에서 열립니다. 폼에서 제출을 누르면 끝납니다.")
            st.link_button("📨 제출 폼 열기", 주소)

st.divider()
with st.expander("다른 사람이 이 컴퓨터를 쓸 때"):
    st.write("적은 내용과 최고 기록은 이 브라우저에 남습니다. 컴퓨터를 넘겨주기 전에 지웁니다.")
    if st.button("내 기록 모두 지우기"):
        for 파일 in 기록폴더.glob("*.json"):
            파일.unlink()
        for 열쇠 in ("최고기록", "방법", "출처", "열설명표", "열설명_바탕"):
            st.session_state.pop(열쇠, None)
        st.rerun()

st.info("**이 흐름은 다른 데이터에도 그대로 됩니다** · 오늘까지 만든 앱은 데이터를 소개하고, 들여다보고, "
        "모델을 만들고, 채점하고, 고치고, 판단하는 여섯 단계로 이루어져 있습니다. "
        "바뀐 것은 데이터 주소와 열 이름뿐입니다.")
