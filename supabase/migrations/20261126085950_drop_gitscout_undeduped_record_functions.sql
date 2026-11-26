-- Tekilleştirme yapmayan ilk sürümler; site artık IP ve tarayıcı bilgisi alan sürümleri çağırıyor.
drop function gitscout.record_page_view(text);
drop function gitscout.record_event(text, jsonb);
