EVENTS = [
 ('2023-berlin',   '2023-08-11','2023-08-14','GBT Berlin 2023'),
 ('2023-hamburg',  '2023-08-17','2023-08-21','Elite16 Hamburg 2023'),
 ('2023-timmendorf','2023-08-31','2023-09-05','Timmendorf 2023'),
 ('2024-mai',      '2024-05-11','2024-05-13','Saisonstart Mai 2024'),
 ('2024-juni',     '2024-06-08','2024-06-10','Juni 2024'),
 ('2024-muenchen', '2024-07-19','2024-07-22','München 2024'),
 ('2024-paris',    '2024-08-08','2024-08-08','Olympia Paris 2024'),
 ('2024-kuehlungsborn','2024-08-16','2024-08-20','Kühlungsborn 2024'),
 ('2024-timmendorf','2024-08-27','2024-09-04','Timmendorf 2024'),
 ('2025-duesseldorf','2025-05-08','2025-05-12','Düsseldorf 2025'),
 ('2025-muenchen', '2025-07-11','2025-07-14','München 2025'),
 ('2025-berlin1',  '2025-08-15','2025-08-18','Berlin I 2025'),
 ('2025-berlin2',  '2025-08-22','2025-08-25','Berlin II 2025'),
 ('2025-timmendorf','2025-09-01','2025-09-08','Timmendorf 2025'),
 ('2026-berlin1',  '2026-06-05','2026-06-08','Berlin I 2026'),
 ('2026-berlin2',  '2026-06-13','2026-06-14','Berlin II 2026'),
 ('2026-muenchen', '2026-07-02','2026-07-06','München 2026'),
 ('2026-hamburg',  '2026-08-07','2026-08-10','Elite16 Hamburg 2026'),
 ('2026-dortmund', '2026-08-25','2026-08-31','Dortmund 2026'),
]
def event(datum):
    d = datum[:10]
    for k, a, b, n in EVENTS:
        if a <= d <= b: return k
    return 'sonstiges'
