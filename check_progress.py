import os

# 성경 데이터가 들어있는 폴더 경로
BASE_PATH = "./bible/ko/"

def inventory_bible_data():
    print("\n" + "="*50)
    print("📊 HolyWord 성경 데이터 입력 현황 보고서")
    print("="*50)

    if not os.path.exists(BASE_PATH):
        print(f"❌ 오류: '{BASE_PATH}' 폴더를 찾을 수 없습니다.")
        print("경로가 맞는지 확인해 주세요.")
        return

    # 폴더 내 모든 성경 책(Book) 폴더 확인
    books = sorted([d for d in os.listdir(BASE_PATH) if os.path.isdir(os.path.join(BASE_PATH, d))])

    if not books:
        print("입력된 성경 데이터가 아직 없습니다.")
        return

    for book in books:
        book_path = os.path.join(BASE_PATH, book)
        # 각 폴더 내의 json 파일 개수 세기
        files = [f for f in os.listdir(book_path) if f.endswith(".json")]
        count = len(files)
        print(f"📖 [{book}] : {count}개 장(Chapter) 데이터 입력됨")

    print("="*50)
    print("보고서 작성이 완료되었습니다.")
    print("="*50 + "\n")

if __name__ == "__main__":
    inventory_bible_data()
    