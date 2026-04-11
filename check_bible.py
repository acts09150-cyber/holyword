import json
import os

# 성경 데이터가 들어있는 폴더 경로 (이미지에서 보인 경로 기준)
BASE_PATH = "./bible/ko/"

# 성경 권별 정답 데이터 (여기에 장별 최대 절수를 입력하면 검사합니다)
BIBLE_MAP = {
    "1CO": [31, 16, 23, 21, 13, 20, 40, 13, 27, 33, 34, 31, 13, 40, 58, 24], # 고전 1~16장
    "1JN": [10, 29, 24, 21, 21], # 요일 1~5장
    # 다른 권을 추가하시면 여기에 제가 정답지를 더 넣어드릴 수 있습니다!
}

def check_bible_data():
    print("\n" + "="*50)
    print("🔍 HolyWord 성경 데이터 전수 검사를 시작합니다...")
    print("="*50)
    
    found_error = False
    
    for book, chapters in BIBLE_MAP.items():
        for i, max_verse in enumerate(chapters):
            chapter_num = i + 1
            # 폴더명과 파일명을 조합합니다 (예: ./bible/ko/1CO/1.json)
            file_path = os.path.join(BASE_PATH, book, f"{chapter_num}.json")
            
            if not os.path.exists(file_path):
                print(f"❌ [파일 없음] {book} {chapter_num}장 파일이 존재하지 않습니다.")
                found_error = True
                continue
                
            try:
                with open(file_path, 'r', encoding='utf-8') as f:
                    data = json.load(f)
                    # JSON 내부의 "v" 리스트 개수를 세어 절 수를 확인합니다.
                    current_verses = len(data.get("v", []))
                    
                    if current_verses != max_verse:
                        print(f"⚠️ [절 수 틀림] {book} {chapter_num}장 (현재: {current_verses}절 / 실제: {max_verse}절)")
                        found_error = True
                    else:
                        print(f"✅ [정상] {book} {chapter_num}장")
            except Exception as e:
                print(f"❗ [형식 오류] {book} {chapter_num}장 JSON 파일에 오타가 있습니다: {e}")
                found_error = True

    print("="*50)
    if not found_error:
        print("🎉 축하합니다! 모든 데이터가 완벽합니다!")
    else:
        print("위의 경고 메시지를 확인하여 데이터를 수정해 주세요.")
    print("="*50 + "\n")

if __name__ == "__main__":
    check_bible_data()