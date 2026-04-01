# -*- coding: utf-8 -*-
"""
산업(소분류 smallName)별 대표기업 3개 데이터.
- 각 항목: representative_company, description, type, revenue, employee_count
- 유형: 대기업, 중견기업, 중소기업, 스타트업, 외국계기업
- 3개 중 최소 1개, 최대 2개 외국계 포함
키: (majorName, middleName, smallName) 또는 smallName
"""
# 키는 (majorName, middleName, smallName) 튜플. 값은 3개 기업 리스트.
# 각 기업: dict with keys: name, description, type, revenue, employee_count

REPRESENTATIVE_COMPANIES = {
    ("농업, 임업 및 어업", "농업", "작물 재배업"): [
        {"name": "농심", "description": "라면·스낵 등 식량가공과 연계한 원료 작물 재배 및 식품 제조. 국내 대표 식품기업.", "type": "대기업", "revenue": "약 2조원", "employee_count": "정보 확인 필요"},
        {"name": "CJ제일제당", "description": "곡물 가공, 바이오 등 농업 연계 사업. 국내 최대 식품·바이오 기업.", "type": "대기업", "revenue": "약 20조원", "employee_count": "정보 확인 필요"},
        {"name": "몬산토 코리아", "description": "종자·농약 등 작물 재배 관련 글로벌 농업 솔루션. 미국 몬산토(바이엘) 한국법인.", "type": "외국계기업", "revenue": "정보 확인 필요", "employee_count": "정보 확인 필요"},
    ],
    ("농업, 임업 및 어업", "농업", "축산업"): [
        {"name": "하림", "description": "국내 대표 축산·식품 기업. 닭고기, 돈육 사육·가공·유통.", "type": "대기업", "revenue": "약 3조원", "employee_count": "정보 확인 필요"},
        {"name": "CJ제일제당", "description": "축산 사료, 식품 가공 등 축산 연계 사업.", "type": "대기업", "revenue": "약 20조원", "employee_count": "정보 확인 필요"},
        {"name": "브라질 JBS", "description": "글로벌 최대 육류 기업. 축산·도축·가공 전 세계 운영.", "type": "외국계기업", "revenue": "약 600억 USD", "employee_count": "정보 확인 필요"},
    ],
    ("농업, 임업 및 어업", "농업", "작물재배 및 축산 복합농업"): [
        {"name": "농협", "description": "농업협동조합. 복합농업·유통 지원.", "type": "대기업", "revenue": "정보 확인 필요", "employee_count": "정보 확인 필요"},
        {"name": "CJ제일제당", "description": "작물·축산 연계 식품·바이오 사업.", "type": "대기업", "revenue": "약 20조원", "employee_count": "정보 확인 필요"},
        {"name": "선진", "description": "종자·농자재·복합농업. 국내 농업 기업.", "type": "중견기업", "revenue": "정보 확인 필요", "employee_count": "정보 확인 필요"},
    ],
    ("농업, 임업 및 어업", "농업", "작물재배 및 축산 관련 서비스업"): [
        {"name": "농협경제지주", "description": "농업 관련 금융·유통·서비스.", "type": "대기업", "revenue": "정보 확인 필요", "employee_count": "정보 확인 필요"},
        {"name": "대한종합건설", "description": "농업시설·축산시설 시공.", "type": "중견기업", "revenue": "정보 확인 필요", "employee_count": "정보 확인 필요"},
        {"name": "존디어 코리아", "description": "농기계·농업서비스. 미국 존디어 한국법인.", "type": "외국계기업", "revenue": "정보 확인 필요", "employee_count": "정보 확인 필요"},
    ],
    ("농업, 임업 및 어업", "농업", "수렵 및 관련 서비스업"): [
        {"name": "한국수렵협회", "description": "수렵 관련 단체·서비스.", "type": "중소기업", "revenue": "정보 확인 필요", "employee_count": "정보 확인 필요"},
        {"name": "정보 확인 필요", "description": "정보 확인 필요", "type": "정보 확인 필요", "revenue": "정보 확인 필요", "employee_count": "정보 확인 필요"},
        {"name": "정보 확인 필요", "description": "정보 확인 필요", "type": "정보 확인 필요", "revenue": "정보 확인 필요", "employee_count": "정보 확인 필요"},
    ],
    ("농업, 임업 및 어업", "임업", "임업"): [
        {"name": "한국임업진흥원", "description": "임업 진흥·연구 공공기관.", "type": "대기업", "revenue": "정보 확인 필요", "employee_count": "정보 확인 필요"},
        {"name": "대림산업", "description": "제지·펄프·임업 연계. 대림그룹.", "type": "대기업", "revenue": "정보 확인 필요", "employee_count": "정보 확인 필요"},
        {"name": "웨이어하우저 코리아", "description": "임업·목재. 미국 웨이어하우저 한국법인.", "type": "외국계기업", "revenue": "정보 확인 필요", "employee_count": "정보 확인 필요"},
    ],
    ("농업, 임업 및 어업", "어업", "어로 어업"): [
        {"name": "동원산업", "description": "원양어업·수산가공. 동원그룹.", "type": "대기업", "revenue": "정보 확인 필요", "employee_count": "정보 확인 필요"},
        {"name": "Sajo industries", "description": "어업·수산. 국내 주요 수산 기업.", "type": "대기업", "revenue": "정보 확인 필요", "employee_count": "정보 확인 필요"},
        {"name": "마루베니 (일본)", "description": "글로벌 수산·어업. 일본 기업.", "type": "외국계기업", "revenue": "정보 확인 필요", "employee_count": "정보 확인 필요"},
    ],
    ("농업, 임업 및 어업", "어업", "양식어업 및 어업관련 서비스업"): [
        {"name": "남해종묘", "description": "양식 종묘·양식어업.", "type": "중견기업", "revenue": "정보 확인 필요", "employee_count": "정보 확인 필요"},
        {"name": "대구수산", "description": "양식어업·수산가공.", "type": "중소기업", "revenue": "정보 확인 필요", "employee_count": "정보 확인 필요"},
        {"name": "Mowi (노르웨이)", "description": "연어 양식 글로벌 1위. 노르웨이 기업.", "type": "외국계기업", "revenue": "정보 확인 필요", "employee_count": "정보 확인 필요"},
    ],
    ("광업", "석탄, 원유 및 천연가스 광업", "석탄 광업"): [
        {"name": "한국광해광업공사", "description": "석탄 광업·에너지. 공공.", "type": "대기업", "revenue": "정보 확인 필요", "employee_count": "정보 확인 필요"},
        {"name": "동부광업", "description": "국내 석탄 광업.", "type": "중견기업", "revenue": "정보 확인 필요", "employee_count": "정보 확인 필요"},
        {"name": "BHP", "description": "석탄·광물 글로벌 광산. 호주.", "type": "외국계기업", "revenue": "정보 확인 필요", "employee_count": "정보 확인 필요"},
    ],
    ("광업", "석탄, 원유 및 천연가스 광업", "원유 및 천연가스 채굴업"): [
        {"name": "한국석유공사", "description": "원유 비축·에너지. 공공.", "type": "대기업", "revenue": "정보 확인 필요", "employee_count": "정보 확인 필요"},
        {"name": "SK이노베이션", "description": "해외 유전·가스 개발. SK그룹.", "type": "대기업", "revenue": "약 60조원", "employee_count": "정보 확인 필요"},
        {"name": "쉘", "description": "원유·천연가스 채굴. 영국/네덜란드.", "type": "외국계기업", "revenue": "정보 확인 필요", "employee_count": "정보 확인 필요"},
    ],
    ("광업", "금속 광업", "철 광업"): [
        {"name": "POSCO", "description": "철광석·철강. 국내 철광 연계.", "type": "대기업", "revenue": "약 70조원", "employee_count": "정보 확인 필요"},
        {"name": "한국광해관리공단", "description": "광해 복구·광업 지원.", "type": "대기업", "revenue": "정보 확인 필요", "employee_count": "정보 확인 필요"},
        {"name": "Rio Tinto", "description": "철광석 글로벌. 영국/호주.", "type": "외국계기업", "revenue": "정보 확인 필요", "employee_count": "정보 확인 필요"},
    ],
    ("광업", "금속 광업", "비철금속 광업"): [
        {"name": "한국광해관리공단", "description": "광업·비철금속 관련.", "type": "대기업", "revenue": "정보 확인 필요", "employee_count": "정보 확인 필요"},
        {"name": "LS니코뮤", "description": "구리 등 비철금속. LS그룹.", "type": "대기업", "revenue": "정보 확인 필요", "employee_count": "정보 확인 필요"},
        {"name": "Freeport-McMoRan", "description": "구리·금 광산 글로벌. 미국.", "type": "외국계기업", "revenue": "정보 확인 필요", "employee_count": "정보 확인 필요"},
    ],
    ("광업", "비금속광물 광업; 연료용 제외", "토사석 광업"): [
        {"name": "한국석회", "description": "석회석·토사석. 국내 광업.", "type": "중견기업", "revenue": "정보 확인 필요", "employee_count": "정보 확인 필요"},
        {"name": "삼양산업", "description": "석회·광물. 건설자재.", "type": "중견기업", "revenue": "정보 확인 필요", "employee_count": "정보 확인 필요"},
        {"name": "정보 확인 필요", "description": "정보 확인 필요", "type": "정보 확인 필요", "revenue": "정보 확인 필요", "employee_count": "정보 확인 필요"},
    ],
    ("광업", "비금속광물 광업; 연료용 제외", "기타 비금속광물 광업"): [
        {"name": "한국중공업", "description": "광물·소재 연계.", "type": "대기업", "revenue": "정보 확인 필요", "employee_count": "정보 확인 필요"},
        {"name": "정보 확인 필요", "description": "정보 확인 필요", "type": "정보 확인 필요", "revenue": "정보 확인 필요", "employee_count": "정보 확인 필요"},
        {"name": "정보 확인 필요", "description": "정보 확인 필요", "type": "정보 확인 필요", "revenue": "정보 확인 필요", "employee_count": "정보 확인 필요"},
    ],
    ("광업", "광업 지원 서비스업", "광업 지원 서비스업"): [
        {"name": "한국광해관리공단", "description": "광해 복구·광업 지원 서비스.", "type": "대기업", "revenue": "정보 확인 필요", "employee_count": "정보 확인 필요"},
        {"name": "두산에너빌리티", "description": "광산 장비·지원. 두산.", "type": "대기업", "revenue": "정보 확인 필요", "employee_count": "정보 확인 필요"},
        {"name": "캐터필러 코리아", "description": "광산 장비·서비스. 미국 캐터필러.", "type": "외국계기업", "revenue": "정보 확인 필요", "employee_count": "정보 확인 필요"},
    ],
    ("제조업", "식료품 제조업", "도축, 육류 가공 및 저장 처리업"): [
        {"name": "하림", "description": "도축, 육류 가공 및 냉동·냉장 저장. 국내 대표 육가공 기업.", "type": "대기업", "revenue": "약 3조원", "employee_count": "정보 확인 필요"},
        {"name": "우진팜", "description": "돈육·계육 가공 및 저장. 국내 육가공 주요 기업.", "type": "중견기업", "revenue": "정보 확인 필요", "employee_count": "정보 확인 필요"},
        {"name": "스미소노 (일본)", "description": "육가공·식품 글로벌 기업. 한국법인 통해 도축·가공 제품 공급.", "type": "외국계기업", "revenue": "정보 확인 필요", "employee_count": "정보 확인 필요"},
    ],
    ("제조업", "식료품 제조업", "수산물 가공 및 저장 처리업"): [
        {"name": "동원F&B", "description": "참치·수산 가공 및 저장. 국내 대표 수산가공 기업.", "type": "대기업", "revenue": "정보 확인 필요", "employee_count": "정보 확인 필요"},
        {"name": "새싹식품", "description": "수산물 가공·저장. 김, 멸치 등 수산가공.", "type": "중소기업", "revenue": "정보 확인 필요", "employee_count": "정보 확인 필요"},
        {"name": "마루젠 (일본)", "description": "수산가공·냉동식품 글로벌. 한국 수출·가공.", "type": "외국계기업", "revenue": "정보 확인 필요", "employee_count": "정보 확인 필요"},
    ],
    ("제조업", "식료품 제조업", "과실, 채소 가공 및 저장 처리업"): [
        {"name": "풀무원", "description": "채소·과실 가공, 냉동·신선식품.", "type": "대기업", "revenue": "정보 확인 필요", "employee_count": "정보 확인 필요"},
        {"name": "CJ제일제당", "description": "과실·채소 가공, 식품.", "type": "대기업", "revenue": "약 20조원", "employee_count": "정보 확인 필요"},
        {"name": "델몬트 코리아", "description": "과실·채소 가공. 미국 델몬트.", "type": "외국계기업", "revenue": "정보 확인 필요", "employee_count": "정보 확인 필요"},
    ],
    ("제조업", "식료품 제조업", "동ㆍ식물성 유지 및 낙농제품 제조업"): [
        {"name": "대상", "description": "식물성유지, 마가린, 낙농제품. 대상그룹.", "type": "대기업", "revenue": "정보 확인 필요", "employee_count": "정보 확인 필요"},
        {"name": "오리온", "description": "유지·과자 등 식품.", "type": "대기업", "revenue": "정보 확인 필요", "employee_count": "정보 확인 필요"},
        {"name": "네슬레 코리아", "description": "낙농·유가공. 스위스 네슬레.", "type": "외국계기업", "revenue": "정보 확인 필요", "employee_count": "정보 확인 필요"},
    ],
    ("제조업", "식료품 제조업", "곡물 가공품, 전분 및 전분제품 제조업"): [
        {"name": "CJ제일제당", "description": "전분, 당류, 곡물가공. 국내 1위.", "type": "대기업", "revenue": "약 20조원", "employee_count": "정보 확인 필요"},
        {"name": "대한제분", "description": "밀가루·전분 제조.", "type": "대기업", "revenue": "정보 확인 필요", "employee_count": "정보 확인 필요"},
        {"name": "ADM 코리아", "description": "곡물가공·전분. 미국 ADM.", "type": "외국계기업", "revenue": "정보 확인 필요", "employee_count": "정보 확인 필요"},
    ],
    ("제조업", "식료품 제조업", "떡, 빵 및 과자류 제조업"): [
        {"name": "CJ제일제당", "description": "빵, 과자, 떡 등 베이커리·스낵 제조. 빵공장, 해찬들 등.", "type": "대기업", "revenue": "약 20조원", "employee_count": "정보 확인 필요"},
        {"name": "삼립식품", "description": "빵, 과자, 냉동식품 제조. 국내 대표 빵·과자 기업.", "type": "대기업", "revenue": "정보 확인 필요", "employee_count": "정보 확인 필요"},
        {"name": "파리바게뜨(SPC)", "description": "빵·케이크 제조·유통. SPC그룹 계열.", "type": "대기업", "revenue": "정보 확인 필요", "employee_count": "정보 확인 필요"},
    ],
    ("제조업", "식료품 제조업", "도시락 및 식사용 조리식품 제조업"): [
        {"name": "CJ프레시웨이", "description": "도시락·조리식품. CJ.", "type": "대기업", "revenue": "정보 확인 필요", "employee_count": "정보 확인 필요"},
        {"name": "풀무원", "description": "도시락·신선조리식품.", "type": "대기업", "revenue": "정보 확인 필요", "employee_count": "정보 확인 필요"},
        {"name": "일상", "description": "도시락·편의식. 국내 조리식품.", "type": "중견기업", "revenue": "정보 확인 필요", "employee_count": "정보 확인 필요"},
    ],
    ("제조업", "식료품 제조업", "기타 식품 제조업"): [
        {"name": "농심", "description": "라면·스낵·기타식품.", "type": "대기업", "revenue": "약 2조원", "employee_count": "정보 확인 필요"},
        {"name": "오리온", "description": "과자·스낵·기타식품.", "type": "대기업", "revenue": "정보 확인 필요", "employee_count": "정보 확인 필요"},
        {"name": "유니레버 코리아", "description": "아이스크림·기타식품. 영국/네덜란드.", "type": "외국계기업", "revenue": "정보 확인 필요", "employee_count": "정보 확인 필요"},
    ],
    ("제조업", "식료품 제조업", "동물용 사료 및 조제식품 제조업"): [
        {"name": "CJ제일제당", "description": "사료·펫푸드. CJ.", "type": "대기업", "revenue": "약 20조원", "employee_count": "정보 확인 필요"},
        {"name": "하림", "description": "축산·사료 연계.", "type": "대기업", "revenue": "약 3조원", "employee_count": "정보 확인 필요"},
        {"name": "마스독푸드", "description": "반려동물 사료·식품.", "type": "중견기업", "revenue": "정보 확인 필요", "employee_count": "정보 확인 필요"},
    ],
    ("제조업", "음료 제조업", "알코올 음료 제조업"): [
        {"name": "하이트진로", "description": "맥주, 소주 등 알코올 음료 제조. 국내 대표 주류 기업.", "type": "대기업", "revenue": "약 3조원", "employee_count": "정보 확인 필요"},
        {"name": "오비맥주", "description": "맥주 제조·판매. 카스, 카스 라이트 등.", "type": "대기업", "revenue": "정보 확인 필요", "employee_count": "정보 확인 필요"},
        {"name": "다이아지오 코리아", "description": "위스키, 보드카 등 스피리츠. 영국 다이아지오 한국법인.", "type": "외국계기업", "revenue": "정보 확인 필요", "employee_count": "정보 확인 필요"},
    ],
    ("제조업", "음료 제조업", "비알코올 음료 및 얼음 제조업"): [
        {"name": "롯데칠성", "description": "탄산음료, 이온음료, 주스 등 비알코올 음료 제조.", "type": "대기업", "revenue": "약 3조원", "employee_count": "정보 확인 필요"},
        {"name": "동아오츠카", "description": "오로나민C, 포카리 등 음료 제조.", "type": "중견기업", "revenue": "정보 확인 필요", "employee_count": "정보 확인 필요"},
        {"name": "코카콜라 음료", "description": "코카콜라, 스프라이트 등 탄산음료 제조·판매. 미국 코카콜라 한국법인.", "type": "외국계기업", "revenue": "정보 확인 필요", "employee_count": "정보 확인 필요"},
    ],
    ("제조업", "전자 부품, 컴퓨터, 영상, 음향 및 통신장비 제조업", "반도체 제조업"): [
        {"name": "삼성전자", "description": "메모리·파운드리 반도체 제조. 글로벌 1위 메모리 반도체.", "type": "대기업", "revenue": "약 258조원", "employee_count": "약 12만명"},
        {"name": "SK하이닉스", "description": "메모리 반도체(DRAM, NAND) 제조. 글로벌 2위 메모리.", "type": "대기업", "revenue": "약 80조원", "employee_count": "약 3만명"},
        {"name": "TSMC", "description": "파운드리(반도체 위탁제조) 글로벌 1위. 대만 기업.", "type": "외국계기업", "revenue": "약 700억 USD", "employee_count": "정보 확인 필요"},
    ],
    ("제조업", "자동차 및 트레일러 제조업", "자동차용 엔진 및 자동차 제조업"): [
        {"name": "현대자동차", "description": "승용차·상용차·엔진 제조. 국내 1위, 글로벌 주요 자동차 기업.", "type": "대기업", "revenue": "약 160조원", "employee_count": "약 6만명"},
        {"name": "기아", "description": "승용차·SUV 등 자동차 및 엔진 제조. 현대차그룹.", "type": "대기업", "revenue": "약 90조원", "employee_count": "정보 확인 필요"},
        {"name": "GM코리아", "description": "쉐보레 등 자동차 제조. 미국 GM 한국법인.", "type": "외국계기업", "revenue": "정보 확인 필요", "employee_count": "정보 확인 필요"},
    ],
    ("제조업", "자동차 및 트레일러 제조업", "자동차 신품 부품 제조업"): [
        {"name": "현대모비스", "description": "자동차 부품(모듈, 부품) 제조. 현대차그룹 계열.", "type": "대기업", "revenue": "약 50조원", "employee_count": "정보 확인 필요"},
        {"name": "만도", "description": "브레이크, 조향 등 자동차 부품 제조.", "type": "대기업", "revenue": "정보 확인 필요", "employee_count": "정보 확인 필요"},
        {"name": "보쉬 코리아", "description": "자동차 부품·전장. 독일 보쉬 한국법인.", "type": "외국계기업", "revenue": "정보 확인 필요", "employee_count": "정보 확인 필요"},
    ],
    ("제조업", "의료용 물질 및 의약품 제조업", "의약품 제조업"): [
        {"name": "유한양행", "description": "의약품 연구·제조·판매. 국내 대표 제약 기업.", "type": "대기업", "revenue": "약 2조원", "employee_count": "정보 확인 필요"},
        {"name": "한미약품", "description": "의약품 제조·수출. 바이오시밀러 등.", "type": "대기업", "revenue": "정보 확인 필요", "employee_count": "정보 확인 필요"},
        {"name": "화이자 코리아", "description": "의약품 제조·판매. 미국 화이자 한국법인.", "type": "외국계기업", "revenue": "정보 확인 필요", "employee_count": "정보 확인 필요"},
    ],
    ("제조업", "기타 운송장비 제조업", "선박 및 보트 건조업"): [
        {"name": "현대중공업", "description": "선박·해양구조물 건조. LNG선 등 대형 선박.", "type": "대기업", "revenue": "약 20조원", "employee_count": "정보 확인 필요"},
        {"name": "삼성중공업", "description": "선박·해양플랜트 건조. 조선 글로벌 톱티어.", "type": "대기업", "revenue": "정보 확인 필요", "employee_count": "정보 확인 필요"},
        {"name": "대우조선해양", "description": "선박·해양구조물 건조. LNG·컨테이너선 등.", "type": "대기업", "revenue": "정보 확인 필요", "employee_count": "정보 확인 필요"},
    ],
    ("금융 및 보험업", "금융업", "은행 및 저축기관"): [
        {"name": "KB금융", "description": "KB국민은행 등 은행·저축업. 국내 대표 금융지주.", "type": "대기업", "revenue": "약 50조원", "employee_count": "정보 확인 필요"},
        {"name": "신한금융", "description": "신한은행 등 은행·저축. 국내 주요 금융지주.", "type": "대기업", "revenue": "정보 확인 필요", "employee_count": "정보 확인 필요"},
        {"name": "씨티은행", "description": "은행업. 미국 시티그룹 한국법인.", "type": "외국계기업", "revenue": "정보 확인 필요", "employee_count": "정보 확인 필요"},
    ],
    ("금융 및 보험업", "보험업", "보험업"): [
        {"name": "삼성화재", "description": "손해보험·자동차보험 등. 국내 대표 손보.", "type": "대기업", "revenue": "약 20조원", "employee_count": "정보 확인 필요"},
        {"name": "현대해상", "description": "손해보험. 현대차그룹 계열.", "type": "대기업", "revenue": "정보 확인 필요", "employee_count": "정보 확인 필요"},
        {"name": "메리츠화재", "description": "손해보험·생보. 메리츠금융그룹.", "type": "대기업", "revenue": "정보 확인 필요", "employee_count": "정보 확인 필요"},
    ],
    ("정보통신업", "컴퓨터 프로그래밍, 시스템 통합 및 관리업", "컴퓨터 프로그래밍, 시스템 통합 및 관리업"): [
        {"name": "삼성SDS", "description": "SI, 클라우드, IT아웃소싱. 삼성그룹 IT 계열.", "type": "대기업", "revenue": "약 15조원", "employee_count": "정보 확인 필요"},
        {"name": "LG CNS", "description": "SI, 시스템 통합, IT 서비스. LG그룹.", "type": "대기업", "revenue": "정보 확인 필요", "employee_count": "정보 확인 필요"},
        {"name": "엔씨소프트", "description": "게임·플랫폼 및 IT 서비스. 국내 대표 게임·IT 기업.", "type": "대기업", "revenue": "정보 확인 필요", "employee_count": "정보 확인 필요"},
    ],
    ("정보통신업", "출판업", "소프트웨어 개발 및 공급업"): [
        {"name": "카카오", "description": "플랫폼·소프트웨어 개발·공급. 메신저, 결제, 엔터 등.", "type": "대기업", "revenue": "약 7조원", "employee_count": "정보 확인 필요"},
        {"name": "네이버", "description": "검색·플랫폼·소프트웨어. 웹서비스, 클라우드.", "type": "대기업", "revenue": "약 8조원", "employee_count": "정보 확인 필요"},
        {"name": "마이크로소프트 코리아", "description": "OS·소프트웨어 개발·공급. 미국 MS 한국법인.", "type": "외국계기업", "revenue": "정보 확인 필요", "employee_count": "정보 확인 필요"},
    ],
    ("건설업", "종합 건설업", "건물 건설업"): [
        {"name": "현대건설", "description": "건물·토목 등 종합 건설. 국내 대표 건설사.", "type": "대기업", "revenue": "약 30조원", "employee_count": "정보 확인 필요"},
        {"name": "삼성물산", "description": "건물·플랜트 건설. 삼성그룹 건설 계열.", "type": "대기업", "revenue": "정보 확인 필요", "employee_count": "정보 확인 필요"},
        {"name": "GS건설", "description": "건물·주택 건설. GS그룹.", "type": "대기업", "revenue": "정보 확인 필요", "employee_count": "정보 확인 필요"},
    ],
    ("건설업", "종합 건설업", "토목 건설업"): [
        {"name": "현대건설", "description": "도로, 교량, 댐 등 토목 건설.", "type": "대기업", "revenue": "약 30조원", "employee_count": "정보 확인 필요"},
        {"name": "대림산업", "description": "토목·건물 건설. 대림그룹.", "type": "대기업", "revenue": "정보 확인 필요", "employee_count": "정보 확인 필요"},
        {"name": "대우건설", "description": "토목·건물·해외 건설.", "type": "대기업", "revenue": "정보 확인 필요", "employee_count": "정보 확인 필요"},
    ],
    ("전기, 가스, 증기 및 공기조절 공급업", "전기, 가스, 증기 및 공기 조절 공급업", "전기업"): [
        {"name": "한국전력", "description": "전력 생산·송배전·공급. 국내 전력 공급 주체.", "type": "대기업", "revenue": "약 70조원", "employee_count": "정보 확인 필요"},
        {"name": "한국수력원자력", "description": "원자력 발전·전력 공급.", "type": "대기업", "revenue": "정보 확인 필요", "employee_count": "정보 확인 필요"},
        {"name": "정보 확인 필요", "description": "정보 확인 필요", "type": "정보 확인 필요", "revenue": "정보 확인 필요", "employee_count": "정보 확인 필요"},
    ],
    ("도매 및 소매업", "자동차 및 부품 판매업", "자동차 판매업"): [
        {"name": "현대자동차", "description": "자동차 제조·판매. 국내 판매망.", "type": "대기업", "revenue": "약 160조원", "employee_count": "정보 확인 필요"},
        {"name": "기아", "description": "자동차 판매. 현대차그룹.", "type": "대기업", "revenue": "약 90조원", "employee_count": "정보 확인 필요"},
        {"name": "메르세데스-벤츠 코리아", "description": "수입차 판매. 독일 다임러 한국법인.", "type": "외국계기업", "revenue": "정보 확인 필요", "employee_count": "정보 확인 필요"},
    ],
    ("운수 및 창고업", "항공 운송업", "항공 여객 운송업"): [
        {"name": "대한항공", "description": "국제·국내 항공 여객 운송. 국적 항공사.", "type": "대기업", "revenue": "약 15조원", "employee_count": "정보 확인 필요"},
        {"name": "아시아나항공", "description": "항공 여객 운송. 아시아나그룹.", "type": "대기업", "revenue": "정보 확인 필요", "employee_count": "정보 확인 필요"},
        {"name": "제주항공", "description": "저비용 항공 여객 운송. LCC.", "type": "중견기업", "revenue": "정보 확인 필요", "employee_count": "정보 확인 필요"},
    ],
    ("숙박 및 음식점업", "음식점 및 주점업", "음식점업"): [
        {"name": "CJ푸드빌", "description": "외식 브랜드(빕스, 투썸 등) 운영. CJ그룹.", "type": "대기업", "revenue": "정보 확인 필요", "employee_count": "정보 확인 필요"},
        {"name": "맥도날드 코리아", "description": "햄버거 등 패스트푸드. 미국 맥도날드 한국법인.", "type": "외국계기업", "revenue": "정보 확인 필요", "employee_count": "정보 확인 필요"},
        {"name": "본죽", "description": "죽·한식 외식. 국내 외식 체인.", "type": "중견기업", "revenue": "정보 확인 필요", "employee_count": "정보 확인 필요"},
    ],
    ("제조업", "담배 제조업", "담배 제조업"): [
        {"name": "KT&G", "description": "담배 제조·판매. 국내 대표 담배 기업.", "type": "대기업", "revenue": "약 5조원", "employee_count": "정보 확인 필요"},
        {"name": "필립모리스 코리아", "description": "담배 제조·판매. 미국 필립모리스 한국법인.", "type": "외국계기업", "revenue": "정보 확인 필요", "employee_count": "정보 확인 필요"},
        {"name": "정보 확인 필요", "description": "정보 확인 필요", "type": "정보 확인 필요", "revenue": "정보 확인 필요", "employee_count": "정보 확인 필요"},
    ],
    ("제조업", "코크스, 연탄 및 석유정제품 제조업", "석유 정제품 제조업"): [
        {"name": "SK이노베이션", "description": "석유 정제, 윤활유, 화학. SK그룹 에너지 계열.", "type": "대기업", "revenue": "약 60조원", "employee_count": "정보 확인 필요"},
        {"name": "S-Oil", "description": "석유 정제. 아람코 계열.", "type": "대기업", "revenue": "정보 확인 필요", "employee_count": "정보 확인 필요"},
        {"name": "GS칼텍스", "description": "석유 정제·판매. GS그룹.", "type": "대기업", "revenue": "정보 확인 필요", "employee_count": "정보 확인 필요"},
    ],
    ("제조업", "1차 금속 제조업", "1차 철강 제조업"): [
        {"name": "POSCO", "description": "1차 철강 제조. 국내 최대 철강사.", "type": "대기업", "revenue": "약 70조원", "employee_count": "정보 확인 필요"},
        {"name": "현대제철", "description": "1차 철강 제조. 현대차그룹.", "type": "대기업", "revenue": "정보 확인 필요", "employee_count": "정보 확인 필요"},
        {"name": "동국제강", "description": "철강 제조. 국내 주요 철강 기업.", "type": "대기업", "revenue": "정보 확인 필요", "employee_count": "정보 확인 필요"},
    ],
    ("제조업", "펄프, 종이 및 종이제품 제조업", "펄프, 종이 및 판지 제조업"): [
        {"name": "한솔제지", "description": "펄프, 종이, 판지 제조. 한솔그룹.", "type": "대기업", "revenue": "정보 확인 필요", "employee_count": "정보 확인 필요"},
        {"name": "한국제지", "description": "종이·판지 제조.", "type": "중견기업", "revenue": "정보 확인 필요", "employee_count": "정보 확인 필요"},
        {"name": "정보 확인 필요", "description": "정보 확인 필요", "type": "정보 확인 필요", "revenue": "정보 확인 필요", "employee_count": "정보 확인 필요"},
    ],
    ("제조업", "인쇄 및 기록매체 복제업", "인쇄 및 인쇄관련 산업"): [
        {"name": "두산솔루스", "description": "인쇄·출판 인프라. 두산그룹.", "type": "대기업", "revenue": "정보 확인 필요", "employee_count": "정보 확인 필요"},
        {"name": "정보 확인 필요", "description": "정보 확인 필요", "type": "정보 확인 필요", "revenue": "정보 확인 필요", "employee_count": "정보 확인 필요"},
        {"name": "정보 확인 필요", "description": "정보 확인 필요", "type": "정보 확인 필요", "revenue": "정보 확인 필요", "employee_count": "정보 확인 필요"},
    ],
    ("정보통신업", "우편 및 통신업", "전기 통신업"): [
        {"name": "KT", "description": "유·무선 통신, 인터넷, IPTV. 국내 대표 통신사.", "type": "대기업", "revenue": "약 26조원", "employee_count": "정보 확인 필요"},
        {"name": "SK텔레콤", "description": "이동통신, 인터넷. SK그룹.", "type": "대기업", "revenue": "약 17조원", "employee_count": "정보 확인 필요"},
        {"name": "LG유플러스", "description": "이동통신, 초고속인터넷. LG그룹.", "type": "대기업", "revenue": "정보 확인 필요", "employee_count": "정보 확인 필요"},
    ],
    ("정보통신업", "방송 및 영상ㆍ오디오물 제공 서비스업", "텔레비전 방송업"): [
        {"name": "KBS", "description": "공영 텔레비전 방송. 한국방송공사.", "type": "대기업", "revenue": "정보 확인 필요", "employee_count": "정보 확인 필요"},
        {"name": "MBC", "description": "지상파 텔레비전 방송.", "type": "대기업", "revenue": "정보 확인 필요", "employee_count": "정보 확인 필요"},
        {"name": "SBS", "description": "지상파 텔레비전 방송.", "type": "대기업", "revenue": "정보 확인 필요", "employee_count": "정보 확인 필요"},
    ],
    ("정보통신업", "정보서비스업", "자료 처리, 호스팅, 포털 및 기타 인터넷 정보 매개 서비스업"): [
        {"name": "네이버", "description": "포털, 클라우드, 데이터센터. 국내 대표 인터넷 기업.", "type": "대기업", "revenue": "약 8조원", "employee_count": "정보 확인 필요"},
        {"name": "카카오", "description": "포털, 메신저, 결제, 호스팅. 플랫폼 기업.", "type": "대기업", "revenue": "약 7조원", "employee_count": "정보 확인 필요"},
        {"name": "AWS 코리아", "description": "클라우드·호스팅. 아마존 웹서비스 한국법인.", "type": "외국계기업", "revenue": "정보 확인 필요", "employee_count": "정보 확인 필요"},
    ],
    ("운수 및 창고업", "창고 및 운송관련 서비스업", "보관 및 창고업"): [
        {"name": "CJ대한통운", "description": "물류·창고·택배. CJ그룹.", "type": "대기업", "revenue": "정보 확인 필요", "employee_count": "정보 확인 필요"},
        {"name": "한진", "description": "물류·창고·해운. 한진그룹.", "type": "대기업", "revenue": "정보 확인 필요", "employee_count": "정보 확인 필요"},
        {"name": "DHL 코리아", "description": "국제 물류·창고. 독일 DHL 한국법인.", "type": "외국계기업", "revenue": "정보 확인 필요", "employee_count": "정보 확인 필요"},
    ],
    ("금융 및 보험업", "금융업", "신탁업 및 집합 투자업"): [
        {"name": "미래에셋", "description": "자산운용, 신탁, 집합투자. 국내 대표 자산운용사.", "type": "대기업", "revenue": "정보 확인 필요", "employee_count": "정보 확인 필요"},
        {"name": "삼성자산운용", "description": "집합투자, 신탁. 삼성그룹.", "type": "대기업", "revenue": "정보 확인 필요", "employee_count": "정보 확인 필요"},
        {"name": "정보 확인 필요", "description": "정보 확인 필요", "type": "정보 확인 필요", "revenue": "정보 확인 필요", "employee_count": "정보 확인 필요"},
    ],
    ("부동산 임대 및 공급업", "부동산업", "부동산 임대 및 공급업"): [
        {"name": "한국토지주택공사", "description": "공공 부동산·주택 공급. LH.", "type": "대기업", "revenue": "정보 확인 필요", "employee_count": "정보 확인 필요"},
        {"name": "신안실업", "description": "부동산 개발·임대. 국내 주요 부동산 기업.", "type": "대기업", "revenue": "정보 확인 필요", "employee_count": "정보 확인 필요"},
        {"name": "정보 확인 필요", "description": "정보 확인 필요", "type": "정보 확인 필요", "revenue": "정보 확인 필요", "employee_count": "정보 확인 필요"},
    ],
    ("전문, 과학 및 기술 서비스업", "전문 서비스업", "법무관련 서비스업"): [
        {"name": "김앤장", "description": "법률 자문·소송. 국내 대표 로펌.", "type": "중견기업", "revenue": "정보 확인 필요", "employee_count": "정보 확인 필요"},
        {"name": "세종", "description": "법률 서비스. 국내 주요 로펌.", "type": "중견기업", "revenue": "정보 확인 필요", "employee_count": "정보 확인 필요"},
        {"name": "정보 확인 필요", "description": "정보 확인 필요", "type": "정보 확인 필요", "revenue": "정보 확인 필요", "employee_count": "정보 확인 필요"},
    ],
    ("전문, 과학 및 기술 서비스업", "전문 서비스업", "광고업"): [
        {"name": "제일기획", "description": "광고 기획·제작. 삼성그룹 광고대행사.", "type": "대기업", "revenue": "정보 확인 필요", "employee_count": "정보 확인 필요"},
        {"name": "이노션", "description": "광고 기획·제작. 현대차그룹.", "type": "대기업", "revenue": "정보 확인 필요", "employee_count": "정보 확인 필요"},
        {"name": "Wavemaker 코리아", "description": "미디어·광고 대행. WPP 그룹 한국법인.", "type": "외국계기업", "revenue": "정보 확인 필요", "employee_count": "정보 확인 필요"},
    ],
    ("보건업 및 사회복지 서비스업", "보건업", "병원"): [
        {"name": "삼성서울병원", "description": "종합병원 운영. 삼성의료원.", "type": "대기업", "revenue": "정보 확인 필요", "employee_count": "정보 확인 필요"},
        {"name": "서울아산병원", "description": "종합병원. 아산재단.", "type": "대기업", "revenue": "정보 확인 필요", "employee_count": "정보 확인 필요"},
        {"name": "세브란스병원", "description": "종합병원. 연세의료원.", "type": "대기업", "revenue": "정보 확인 필요", "employee_count": "정보 확인 필요"},
    ],
    ("교육 서비스업", "교육 서비스업", "고등 교육기관"): [
        {"name": "서울대학교", "description": "국립 대학. 국내 대표 고등교육기관.", "type": "대기업", "revenue": "정보 확인 필요", "employee_count": "정보 확인 필요"},
        {"name": "연세대학교", "description": "사립 대학. 고등교육.", "type": "대기업", "revenue": "정보 확인 필요", "employee_count": "정보 확인 필요"},
        {"name": "고려대학교", "description": "사립 대학. 고등교육.", "type": "대기업", "revenue": "정보 확인 필요", "employee_count": "정보 확인 필요"},
    ],
    ("제조업", "전자 부품, 컴퓨터, 영상, 음향 및 통신장비 제조업", "전자 부품 제조업"): [
        {"name": "삼성전기", "description": "전자 부품(MLCC, PCB 등) 제조. 삼성그룹.", "type": "대기업", "revenue": "정보 확인 필요", "employee_count": "정보 확인 필요"},
        {"name": "LG이노텍", "description": "전자 부품 제조. LG그룹.", "type": "대기업", "revenue": "정보 확인 필요", "employee_count": "정보 확인 필요"},
        {"name": "무라타 제조소", "description": "전자 부품 글로벌. 일본 기업 한국법인.", "type": "외국계기업", "revenue": "정보 확인 필요", "employee_count": "정보 확인 필요"},
    ],
    ("제조업", "전기장비 제조업", "일차전지 및 이차전지 제조업"): [
        {"name": "LG에너지솔루션", "description": "이차전지(배터리) 제조. LG그룹.", "type": "대기업", "revenue": "약 25조원", "employee_count": "정보 확인 필요"},
        {"name": "삼성SDI", "description": "이차전지, 전자소재 제조. 삼성그룹.", "type": "대기업", "revenue": "약 20조원", "employee_count": "정보 확인 필요"},
        {"name": "SK온", "description": "이차전지 제조. SK그룹.", "type": "대기업", "revenue": "정보 확인 필요", "employee_count": "정보 확인 필요"},
    ],
    ("제조업", "기타 기계 및 장비 제조업", "특수 목적용 기계 제조업"): [
        {"name": "두산에너빌리티", "description": "발전·플랜트 기계 제조. 두산그룹.", "type": "대기업", "revenue": "정보 확인 필요", "employee_count": "정보 확인 필요"},
        {"name": "한화에어로스페이스", "description": "항공·방산 기계. 한화그룹.", "type": "대기업", "revenue": "정보 확인 필요", "employee_count": "정보 확인 필요"},
        {"name": "정보 확인 필요", "description": "정보 확인 필요", "type": "정보 확인 필요", "revenue": "정보 확인 필요", "employee_count": "정보 확인 필요"},
    ],
    ("제조업", "의료, 정밀, 광학 기기 및 시계 제조업", "의료용 기기 제조업"): [
        {"name": "삼성메디슨", "description": "의료 영상·진단 기기 제조. 삼성그룹.", "type": "대기업", "revenue": "정보 확인 필요", "employee_count": "정보 확인 필요"},
        {"name": "에스엠티", "description": "의료기기 제조. 국내 의료기기 기업.", "type": "중견기업", "revenue": "정보 확인 필요", "employee_count": "정보 확인 필요"},
        {"name": "메드트로닉 코리아", "description": "의료기기. 미국 메드트로닉 한국법인.", "type": "외국계기업", "revenue": "정보 확인 필요", "employee_count": "정보 확인 필요"},
    ],
    # --- 섬유·의복·가죽·목재·종이 ---
    ("제조업", "섬유제품 제조업; 의복 제외", "방적 및 가공사 제조업"): [
        {"name": "코오롱인더스트리", "description": "방적·화학섬유. 코오롱그룹.", "type": "대기업", "revenue": "정보 확인 필요", "employee_count": "정보 확인 필요"},
        {"name": "효성", "description": "티레벌·방적. 국내 대표 섬유.", "type": "대기업", "revenue": "정보 확인 필요", "employee_count": "정보 확인 필요"},
        {"name": "토레이 코리아", "description": "화학섬유·방적. 일본 토레이.", "type": "외국계기업", "revenue": "정보 확인 필요", "employee_count": "정보 확인 필요"},
    ],
    ("제조업", "섬유제품 제조업; 의복 제외", "직물 직조 및 직물제품 제조업"): [
        {"name": "코오롱글로벌", "description": "직물·원단 제조.", "type": "대기업", "revenue": "정보 확인 필요", "employee_count": "정보 확인 필요"},
        {"name": "한세실업", "description": "직물·섬유제품.", "type": "대기업", "revenue": "정보 확인 필요", "employee_count": "정보 확인 필요"},
        {"name": "정보 확인 필요", "description": "정보 확인 필요", "type": "정보 확인 필요", "revenue": "정보 확인 필요", "employee_count": "정보 확인 필요"},
    ],
    ("제조업", "섬유제품 제조업; 의복 제외", "편조 원단 제조업"): [
        {"name": "코오롱", "description": "편조·원단. 코오롱그룹.", "type": "대기업", "revenue": "정보 확인 필요", "employee_count": "정보 확인 필요"},
        {"name": "한세실업", "description": "편조원단·의류소재.", "type": "대기업", "revenue": "정보 확인 필요", "employee_count": "정보 확인 필요"},
        {"name": "정보 확인 필요", "description": "정보 확인 필요", "type": "정보 확인 필요", "revenue": "정보 확인 필요", "employee_count": "정보 확인 필요"},
    ],
    ("제조업", "섬유제품 제조업; 의복 제외", "섬유제품 염색, 정리 및 마무리 가공업"): [
        {"name": "한세실업", "description": "염색·가공. 국내 섬유.", "type": "대기업", "revenue": "정보 확인 필요", "employee_count": "정보 확인 필요"},
        {"name": "코오롱", "description": "섬유 염색·마무리.", "type": "대기업", "revenue": "정보 확인 필요", "employee_count": "정보 확인 필요"},
        {"name": "정보 확인 필요", "description": "정보 확인 필요", "type": "정보 확인 필요", "revenue": "정보 확인 필요", "employee_count": "정보 확인 필요"},
    ],
    ("제조업", "섬유제품 제조업; 의복 제외", "기타 섬유제품 제조업"): [
        {"name": "코오롱인더스트리", "description": "산업용 섬유·기타 섬유제품.", "type": "대기업", "revenue": "정보 확인 필요", "employee_count": "정보 확인 필요"},
        {"name": "효성", "description": "타이어코드·기타 섬유.", "type": "대기업", "revenue": "정보 확인 필요", "employee_count": "정보 확인 필요"},
        {"name": "정보 확인 필요", "description": "정보 확인 필요", "type": "정보 확인 필요", "revenue": "정보 확인 필요", "employee_count": "정보 확인 필요"},
    ],
    ("제조업", "의복, 의복 액세서리 및 모피제품 제조업", "봉제의복 제조업"): [
        {"name": "영원무역", "description": "봉제의복·아웃도어. 국내 대표 의류 제조.", "type": "대기업", "revenue": "정보 확인 필요", "employee_count": "정보 확인 필요"},
        {"name": "한세실업", "description": "봉제의복·OEM.", "type": "대기업", "revenue": "정보 확인 필요", "employee_count": "정보 확인 필요"},
        {"name": "유니클로 코리아", "description": "의복 제조·판매. 일본 패스트리테일.", "type": "외국계기업", "revenue": "정보 확인 필요", "employee_count": "정보 확인 필요"},
    ],
    ("제조업", "의복, 의복 액세서리 및 모피제품 제조업", "모피제품 제조업"): [
        {"name": "LF", "description": "모피·패션 악세서리. LF그룹.", "type": "대기업", "revenue": "정보 확인 필요", "employee_count": "정보 확인 필요"},
        {"name": "한세실업", "description": "모피·의류 소재. 국내.", "type": "대기업", "revenue": "정보 확인 필요", "employee_count": "정보 확인 필요"},
        {"name": "Fendi 코리아", "description": "모피·럭셔리. 이탈리아 LVMH.", "type": "외국계기업", "revenue": "정보 확인 필요", "employee_count": "정보 확인 필요"},
    ],
    ("제조업", "의복, 의복 액세서리 및 모피제품 제조업", "편조의복 제조업"): [
        {"name": "한세실업", "description": "편조의복·니트웨어.", "type": "대기업", "revenue": "정보 확인 필요", "employee_count": "정보 확인 필요"},
        {"name": "LF", "description": "편조·의류. LF그룹.", "type": "대기업", "revenue": "정보 확인 필요", "employee_count": "정보 확인 필요"},
        {"name": "정보 확인 필요", "description": "정보 확인 필요", "type": "정보 확인 필요", "revenue": "정보 확인 필요", "employee_count": "정보 확인 필요"},
    ],
    ("제조업", "의복, 의복 액세서리 및 모피제품 제조업", "의복 액세서리 제조업"): [
        {"name": "LF", "description": "액세서리·의류. LF.", "type": "대기업", "revenue": "정보 확인 필요", "employee_count": "정보 확인 필요"},
        {"name": "신원", "description": "의류·액세서리 제조.", "type": "중견기업", "revenue": "정보 확인 필요", "employee_count": "정보 확인 필요"},
        {"name": "정보 확인 필요", "description": "정보 확인 필요", "type": "정보 확인 필요", "revenue": "정보 확인 필요", "employee_count": "정보 확인 필요"},
    ],
    ("제조업", "가죽, 가방 및 신발 제조업", "가죽, 가방 및 유사 제품 제조업"): [
        {"name": "신성통상", "description": "가방·가죽제품. 국내 대표.", "type": "대기업", "revenue": "정보 확인 필요", "employee_count": "정보 확인 필요"},
        {"name": "LF", "description": "가방·가죽. LF그룹.", "type": "대기업", "revenue": "정보 확인 필요", "employee_count": "정보 확인 필요"},
        {"name": "루이비통 코리아", "description": "가죽·가방. 프랑스 LVMH.", "type": "외국계기업", "revenue": "정보 확인 필요", "employee_count": "정보 확인 필요"},
    ],
    ("제조업", "가죽, 가방 및 신발 제조업", "신발 및 신발 부분품 제조업"): [
        {"name": "아식스 코리아", "description": "스포츠화 제조·판매. 일본 아식스.", "type": "외국계기업", "revenue": "정보 확인 필요", "employee_count": "정보 확인 필요"},
        {"name": "에이스", "description": "신발 제조. 국내 신발 기업.", "type": "중견기업", "revenue": "정보 확인 필요", "employee_count": "정보 확인 필요"},
        {"name": "컨버스 코리아", "description": "신발. 미국 나이키 계열.", "type": "외국계기업", "revenue": "정보 확인 필요", "employee_count": "정보 확인 필요"},
    ],
    ("제조업", "목재 및 나무제품 제조업; 가구 제외", "제재 및 목재 가공업"): [
        {"name": "대림산업", "description": "제재·목재. 대림.", "type": "대기업", "revenue": "정보 확인 필요", "employee_count": "정보 확인 필요"},
        {"name": "한솔제지", "description": "목재·펄프 연계.", "type": "대기업", "revenue": "정보 확인 필요", "employee_count": "정보 확인 필요"},
        {"name": "정보 확인 필요", "description": "정보 확인 필요", "type": "정보 확인 필요", "revenue": "정보 확인 필요", "employee_count": "정보 확인 필요"},
    ],
    ("제조업", "목재 및 나무제품 제조업; 가구 제외", "나무제품 제조업"): [
        {"name": "한솔", "description": "나무제품·보드. 한솔그룹.", "type": "대기업", "revenue": "정보 확인 필요", "employee_count": "정보 확인 필요"},
        {"name": "대림산업", "description": "목재·나무제품.", "type": "대기업", "revenue": "정보 확인 필요", "employee_count": "정보 확인 필요"},
        {"name": "정보 확인 필요", "description": "정보 확인 필요", "type": "정보 확인 필요", "revenue": "정보 확인 필요", "employee_count": "정보 확인 필요"},
    ],
    ("제조업", "목재 및 나무제품 제조업; 가구 제외", "코르크 및 조물 제품 제조업"): [
        {"name": "한솔", "description": "목재·코르크류 소재. 한솔그룹.", "type": "대기업", "revenue": "정보 확인 필요", "employee_count": "정보 확인 필요"},
        {"name": "대림산업", "description": "목재·조물 제품. 대림.", "type": "대기업", "revenue": "정보 확인 필요", "employee_count": "정보 확인 필요"},
        {"name": "정보 확인 필요", "description": "정보 확인 필요", "type": "정보 확인 필요", "revenue": "정보 확인 필요", "employee_count": "정보 확인 필요"},
    ],
    ("제조업", "펄프, 종이 및 종이제품 제조업", "골판지, 종이 상자 및 종이 용기 제조업"): [
        {"name": "한솔제지", "description": "골판지·종이상자. 한솔.", "type": "대기업", "revenue": "정보 확인 필요", "employee_count": "정보 확인 필요"},
        {"name": "일진머티리얼즈", "description": "종이용기·포장.", "type": "중견기업", "revenue": "정보 확인 필요", "employee_count": "정보 확인 필요"},
        {"name": "정보 확인 필요", "description": "정보 확인 필요", "type": "정보 확인 필요", "revenue": "정보 확인 필요", "employee_count": "정보 확인 필요"},
    ],
    ("제조업", "펄프, 종이 및 종이제품 제조업", "기타 종이 및 판지 제품 제조업"): [
        {"name": "한솔제지", "description": "종이·판지 제품. 한솔.", "type": "대기업", "revenue": "정보 확인 필요", "employee_count": "정보 확인 필요"},
        {"name": "한국제지", "description": "종이제품 제조.", "type": "중견기업", "revenue": "정보 확인 필요", "employee_count": "정보 확인 필요"},
        {"name": "정보 확인 필요", "description": "정보 확인 필요", "type": "정보 확인 필요", "revenue": "정보 확인 필요", "employee_count": "정보 확인 필요"},
    ],
    ("제조업", "인쇄 및 기록매체 복제업", "기록매체 복제업"): [
        {"name": "SKC", "description": "기록매체·필름. SK그룹.", "type": "대기업", "revenue": "정보 확인 필요", "employee_count": "정보 확인 필요"},
        {"name": "정보 확인 필요", "description": "정보 확인 필요", "type": "정보 확인 필요", "revenue": "정보 확인 필요", "employee_count": "정보 확인 필요"},
        {"name": "정보 확인 필요", "description": "정보 확인 필요", "type": "정보 확인 필요", "revenue": "정보 확인 필요", "employee_count": "정보 확인 필요"},
    ],
    ("제조업", "코크스, 연탄 및 석유정제품 제조업", "코크스 및 연탄 제조업"): [
        {"name": "포스코케미칼", "description": "코크스·탄소소재. POSCO.", "type": "대기업", "revenue": "정보 확인 필요", "employee_count": "정보 확인 필요"},
        {"name": "정보 확인 필요", "description": "정보 확인 필요", "type": "정보 확인 필요", "revenue": "정보 확인 필요", "employee_count": "정보 확인 필요"},
        {"name": "정보 확인 필요", "description": "정보 확인 필요", "type": "정보 확인 필요", "revenue": "정보 확인 필요", "employee_count": "정보 확인 필요"},
    ],
}

# 기본값: 3개 모두 "정보 확인 필요"
DEFAULT_COMPANIES = [
    {"name": "정보 확인 필요", "description": "정보 확인 필요", "type": "정보 확인 필요", "revenue": "정보 확인 필요", "employee_count": "정보 확인 필요"},
    {"name": "정보 확인 필요", "description": "정보 확인 필요", "type": "정보 확인 필요", "revenue": "정보 확인 필요", "employee_count": "정보 확인 필요"},
    {"name": "정보 확인 필요", "description": "정보 확인 필요", "type": "정보 확인 필요", "revenue": "정보 확인 필요", "employee_count": "정보 확인 필요"},
]


def get_companies(major_name: str, middle_name: str, small_name: str) -> list:
    """(majorName, middleName, smallName)에 해당하는 대표기업 3개 반환."""
    key = (major_name, middle_name, small_name)
    if key in REPRESENTATIVE_COMPANIES:
        return [c.copy() for c in REPRESENTATIVE_COMPANIES[key]]
    try:
        from industry_representative_companies_extra import get_extra_companies
        extra = get_extra_companies(major_name, middle_name, small_name)
        if extra is not None:
            return extra
    except Exception:
        pass
    return [c.copy() for c in DEFAULT_COMPANIES]
