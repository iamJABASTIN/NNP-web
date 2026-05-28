-- Add translation columns to categories
ALTER TABLE public.categories 
ADD COLUMN IF NOT EXISTS name_ta TEXT;

-- Add translation columns to menu_items
ALTER TABLE public.menu_items 
ADD COLUMN IF NOT EXISTS name_ta TEXT,
ADD COLUMN IF NOT EXISTS description_ta TEXT;

-- Populate Categories translations
UPDATE public.categories SET name_ta = 'வட இந்திய உணவுகள்' WHERE name = 'North Indian Foods';
UPDATE public.categories SET name_ta = 'தென் இந்திய உணவுகள்' WHERE name = 'South Indian Foods';
UPDATE public.categories SET name_ta = 'சீன உணவுகள்' WHERE name = 'Chinese Foods';

-- Populate Menu Items translations
UPDATE public.menu_items SET name_ta = 'கடாய் சிக்கன் கிரேவி', description_ta = 'தக்காளி, குடைமிளகாய் மற்றும் மசாலாக்களுடன் சமைக்கப்பட்ட சிக்கன் கிரேவி' WHERE name = 'Kadai Chicken Gravy';
UPDATE public.menu_items SET name_ta = 'ரொட்டி', description_ta = 'கோதுமை மாவில் சுடச்சுட தயாரிக்கப்பட்ட மென்மையான ரொட்டி' WHERE name = 'Roti';
UPDATE public.menu_items SET name_ta = 'சப்பாத்தி', description_ta = 'தவாவில் சுடப்பட்ட மென்மையான மற்றும் சுவையான சப்பாத்தி' WHERE name = 'Chapathi';
UPDATE public.menu_items SET name_ta = 'சிக்கன் கிரேவி', description_ta = 'வெங்காயம், தக்காளி மற்றும் மசாலாக்களுடன் மெதுவாக சமைக்கப்பட்ட சிக்கன் கிரேவி' WHERE name = 'Chicken Gravy';
UPDATE public.menu_items SET name_ta = 'பன்னீர் பட்டர் மசாலா', description_ta = 'மென்மையான பன்னீர் துண்டுகள் சேர்க்கப்பட்ட வெண்ணெய் கலந்த சுவையான கிரேவி' WHERE name = 'Paneer Butter Masala';
UPDATE public.menu_items SET name_ta = 'மிளகு சிக்கன் கிரேவி', description_ta = 'அரைத்த மிளகு மற்றும் தேங்காய் சேர்த்து காரசாரமாக சமைக்கப்பட்ட சிக்கன் கிரேவி' WHERE name = 'Pepper Chicken Gravy';
UPDATE public.menu_items SET name_ta = 'செட்டிநாடு சிக்கன்', description_ta = 'கல்பாசி மற்றும் பாரம்பரிய மசாலா அரைத்து செய்யப்பட்ட காரசாரமான செட்டிநாடு சிக்கன்' WHERE name = 'Chettinad Chicken';
UPDATE public.menu_items SET name_ta = 'பள்ளிபாளையம் சிக்கன்', description_ta = 'சின்ன வெங்காயம், காய்ந்த மிளகாய் மற்றும் தேங்காய் சேர்த்து வதக்கிய பள்ளிபாளையம் சிக்கன்' WHERE name = 'Pallipalayam Chicken';
UPDATE public.menu_items SET name_ta = 'காளான் கிரேவி', description_ta = 'வெங்காயம், தக்காளி மற்றும் மசாலாக்களுடன் சமைக்கப்பட்ட காளான் கிரேவி' WHERE name = 'Mushroom Gravy';
UPDATE public.menu_items SET name_ta = 'பாயசம்', description_ta = 'சேமியா, பால் மற்றும் ஏலக்காய் சேர்த்து தயாரிக்கப்பட்ட சுவையான பாயசம்' WHERE name = 'Payasam';
UPDATE public.menu_items SET name_ta = 'வெங்காய ரோஸ்ட்', description_ta = 'பொன்னிறமாக வதக்கிய வெங்காயம் தூவிய மொறுமொறுப்பான தோசை' WHERE name = 'Onion Roast';
UPDATE public.menu_items SET name_ta = 'நெய் ரோஸ்ட்', description_ta = 'சுத்தமான நெய் சேர்த்து சுடப்பட்ட மொறுமொறுப்பான நெய் ரோஸ்ட்' WHERE name = 'Ghee Roast';
UPDATE public.menu_items SET name_ta = 'வெங்காய ஊத்தப்பாம்', description_ta = 'வெங்காயம் தூவி சுடப்பட்ட மென்மையான மற்றும் தடிமனான ஊத்தப்பாம்' WHERE name = 'Onion Uthappam';
UPDATE public.menu_items SET name_ta = 'கொத்து பரோட்டா', description_ta = 'முட்டை, வெங்காயம் மற்றும் மசாலாக்களுடன் சேர்த்து கொத்தப்பட்ட பரோட்டா' WHERE name = 'Kothu Parotta';
UPDATE public.menu_items SET name_ta = 'சில்லி பரோட்டா', description_ta = 'பச்சை மிளகாய், குடைமிளகாய் மற்றும் காரசாரமான சாஸ் சேர்த்து வதக்கிய பரோட்டா துண்டுகள்' WHERE name = 'Chilli Parotta';
UPDATE public.menu_items SET name_ta = 'ஆம்லெட்', description_ta = 'வெங்காயம், பச்சை மிளகாய் மற்றும் கொத்தமல்லி சேர்த்து சுடப்பட்ட முட்டை ஆம்லெட்' WHERE name = 'Omelette';
UPDATE public.menu_items SET name_ta = 'தோசை', description_ta = 'சட்னி மற்றும் சாம்பாருடன் பரிமாறப்படும் மொறுமொறுப்பான தோசை' WHERE name = 'Dosa';
UPDATE public.menu_items SET name_ta = 'கலக்கி', description_ta = 'நெல்லை பாரம்பரிய முறையில் தயாரிக்கப்பட்ட சுவையான இனிப்பு கலக்கி' WHERE name = 'Kalki';
UPDATE public.menu_items SET name_ta = 'சாப்பாடு', description_ta = 'சாதம், சாம்பார், ரசம், கூட்டு, அப்பளம் அடங்கிய தென்னிந்திய சாப்பாடு' WHERE name = 'Meals';
UPDATE public.menu_items SET name_ta = 'சிக்கன் பிரியாணி', description_ta = 'மசாலாக்கள் மற்றும் சிக்கன் சேர்த்து சீரக சம்பா/பாஸ்மதி அரிசியில் சமைக்கப்பட்ட பிரியாணி' WHERE name = 'Chicken Biryani';
UPDATE public.menu_items SET name_ta = 'ரோஸ்ட்', description_ta = 'மொறுமொறுப்பான பொன்னிற தோசை' WHERE name = 'Roast';
UPDATE public.menu_items SET name_ta = 'ஐஸ்கிரீம்', description_ta = 'குளிர்ந்த ஐஸ்கிரீம் (சுவைகளை ஊழியர்களிடம் கேட்கவும்)' WHERE name = 'Ice Cream';
UPDATE public.menu_items SET name_ta = 'குளிர்பானங்கள்', description_ta = 'குளிரூட்டப்பட்ட குளிர்பானங்கள் மற்றும் சோடாக்கள்' WHERE name = 'Cool Drinks';
UPDATE public.menu_items SET name_ta = 'வெஜ் கிரேவி', description_ta = 'காயகறிகள் சேர்த்து தக்காளி மற்றும் வெங்காய விழுதில் சமைக்கப்பட்ட சுவையான வெஜ் கிரேவி' WHERE name = 'Veg Gravy';
UPDATE public.menu_items SET name_ta = 'சிக்கன் வறுவல்', description_ta = 'மிளகு மற்றும் கறிவேப்பிலை சேர்த்து வதக்கிய சுவையான சிக்கன் வறுவல்' WHERE name = 'Chicken Varuval';
UPDATE public.menu_items SET name_ta = 'குஸ்கா', description_ta = 'மசாலாக்கள் சேர்த்து சமைக்கப்பட்ட பிரியாணி சாதம் (சிக்கன் துண்டுகள் இல்லாதது)' WHERE name = 'Kuska';
UPDATE public.menu_items SET name_ta = 'தக்காளி சாதம்', description_ta = 'தக்காளி மற்றும் வெங்காயத்துடன் தாளித்து சமைக்கப்பட்ட சுவையான தக்காளி சாதம்' WHERE name = 'Tomato Rice';
UPDATE public.menu_items SET name_ta = 'தயிர் சாதம்', description_ta = 'கடுகு, இஞ்சி மற்றும் பச்சை மிளகாய் தாளித்து தயிரில் கலந்த சாதம்' WHERE name = 'Curd Rice';
UPDATE public.menu_items SET name_ta = 'சிக்கன் ரைஸ்', description_ta = 'சிக்கன் மற்றும் காயறிகள் சேர்த்து வதக்கப்பட்ட பிரைடு ரைஸ்' WHERE name = 'Chicken Rice';
UPDATE public.menu_items SET name_ta = 'காலிஃபிளவர் சில்லி', description_ta = 'காலிஃபிளவர் துண்டுகளை மசாலா சேர்த்து மொறுமொறுப்பாக பொரித்த சில்லி' WHERE name = 'Cauliflower Chilli';
UPDATE public.menu_items SET name_ta = 'காளான் சில்லி', description_ta = 'காளான்களை மசாலா சேர்த்து மொறுமொறுப்பாக பொரித்த சில்லி' WHERE name = 'Mushroom Chilli';
UPDATE public.menu_items SET name_ta = 'வெஜ் ரைஸ்', description_ta = 'காய்கறிகள் மற்றும் சோயா சாஸ் சேர்த்து வதக்கப்பட்ட வெஜ் பிரைடு ரைஸ்' WHERE name = 'Veg Rice';
UPDATE public.menu_items SET name_ta = 'சிக்கன் சூப்', description_ta = 'இஞ்சி, பூண்டு மற்றும் மிளகு சேர்த்து சமைக்கப்பட்ட சூடான சிக்கன் சூப்' WHERE name = 'Chicken Soup';
UPDATE public.menu_items SET name_ta = 'சில்லி சிக்கன்', description_ta = 'சிக்கன் துண்டுகளை மசாலா சேர்த்து பொரித்த காரசாரமான சில்லி சிக்கன்' WHERE name = 'Chicken Chilli';
UPDATE public.menu_items SET name_ta = 'முட்டை ரைஸ்', description_ta = 'முட்டை மற்றும் காய்கறிகள் சேர்த்து வதக்கப்பட்ட எக் பிரைடு ரைஸ்' WHERE name = 'Egg Rice';
UPDATE public.menu_items SET name_ta = 'ஆட்டுக்கால் சூப்', description_ta = 'ஆட்டுக்கால் எலும்புகளை மிளகு தூள் சேர்த்து மெதுவாக வேகவைத்த சத்தான சூப்' WHERE name = 'Goat Leg Soup';
UPDATE public.menu_items SET name_ta = 'சிக்கன் நூடுல்ஸ்', description_ta = 'நூடுல்ஸ் உடன் சிக்கன் மற்றும் காய்கறிகள் சேர்த்து வதக்கிய சிக்கன் நூடுல்ஸ்' WHERE name = 'Chicken Noodles';
UPDATE public.menu_items SET name_ta = 'முட்டை நூடுல்ஸ்', description_ta = 'நூடுல்ஸ் உடன் முட்டை மற்றும் காய்கறிகள் சேர்த்து வதக்கிய முட்டை நூடுல்ஸ்' WHERE name = 'Egg Noodles';
UPDATE public.menu_items SET name_ta = 'வெஜ் நூடுல்ஸ்', description_ta = 'காய்கறிகள் மற்றும் சாஸ் சேர்த்து வதக்கிய வெஜ் நூடுல்ஸ்' WHERE name = 'Veg Noodles';
UPDATE public.menu_items SET name_ta = 'காலிஃபிளவர் மஞ்சூரியன்', description_ta = 'பொரித்த காலிஃபிளவர் துண்டுகளை மஞ்சூரியன் சாஸில் வதக்கிய சுவையான உணவு' WHERE name = 'Cauliflower Manchurian';
UPDATE public.menu_items SET name_ta = 'இஞ்சி சிக்கன்', description_ta = 'இஞ்சி மற்றும் மசாலாக்கள் சேர்த்து வதக்கிய சுவையான சிக்கன்' WHERE name = 'Ginger Chicken';
UPDATE public.menu_items SET name_ta = 'காளான் மஞ்சூரியன்', description_ta = 'பொரித்த காளான்களை மஞ்சூரியன் சாஸில் வதக்கிய சுவையான உணவு' WHERE name = 'Mushroom Manchurian';
UPDATE public.menu_items SET name_ta = 'சைனா சில்லி சிக்கன்', description_ta = 'சீன சாஸ் மற்றும் மசாலாக்கள் சேர்த்து காரசாரமாக சமைக்கப்பட்ட சிக்கன்' WHERE name = 'China Chilli Chicken';
