
import json
import os

# New questions from user
new_quiz_data = {
  "questions": [
    {
      "question": "What is the meaning of the word 'Rack'? || 'Rack' என்ற சொல்லின் பொருள் என்ன?",
      "options": ["A large bag || ஒரு பெரிய பை", "A stand to keep things || பொருட்களை வைக்க உதவும் ஒரு அடுக்கு", "A flying machine || ஒரு பறக்கும் இயந்திரம்", "A type of robot || ஒரு வகை ரோபோ"],
      "answer": 1,
      "explanation": "A rack is defined as a stand to keep things. || 'Rack' என்பது பொருட்களை ஒழுங்காக வைப்பதற்கான ஒரு அலமாரி அல்லது அடுக்கு ஆகும்."
    },
    {
      "question": "What does 'Sack' mean? || 'Sack' என்பதன் பொருள் என்ன?",
      "options": ["A large bag used for storing and carrying goods || பொருட்களைச் சேமிக்கவும் சுமக்கவும் பயன்படும் பெரிய பை", "A large exhibition || ஒரு பெரிய கண்காட்சி", "Something that looks like a human || மனிதனைப் போன்ற தோற்றம் கொண்டது", "Not ready to do any work || வேலை செய்யத் தயாராக இல்லாத நிலை"],
      "answer": 0,
      "explanation": "A sack is a large bag used for storing and carrying goods. || 'Sack' என்பது பொருட்களைச் சேமிக்கவும் சுமக்கவும் பயன்படும் ஒரு பெரிய பையாகும்."
    },
    {
      "question": "What does it mean to be 'lazy'? || 'Lazy' (சோம்பேறி) என்பதன் பொருள் என்ன?",
      "options": ["Very active and fast || மிகவும் சுறுசுறுப்பாகவும் வேகமாகவும் இருப்பது", "Highly intelligent || அதிக புத்திசாலித்தனம்", "Not ready to do any work || எந்த வேலையும் செய்யத் தயாராக இல்லாத நிலை", "Always on time || எப்போதும் நேரத்திற்கு வருவது"],
      "answer": 2,
      "explanation": "A lazy person is someone who is not ready to do any work. || சோம்பேறி என்பவர் எந்த வேலையும் செய்யத் தயாராக இல்லாத ஒருவரைக் குறிக்கும்."
    },
    {
      "question": "What is an 'Expo'? || 'Expo' (எக்ஸ்போ) என்பது என்ன?",
      "options": ["A large international exhibition || ஒரு பெரிய பன்னாட்டு கண்காட்சி", "A small grocery store || ஒரு சிறிய மளிகைக் கடை", "A school playground || பள்ளி விளையாட்டு மைதானம்", "A type of mechanical part || ஒரு வகை இயந்திரப் பாகம்"],
      "answer": 0,
      "explanation": "An 'Expo' is a large-scale international exhibition or trade fair. || 'எக்ஸ்போ' என்பது ஒரு பெரிய அளவிலான பன்னாட்டு கண்காட்சி ஆகும்."
    },
    {
      "question": "What is a 'Humanoid'? || 'Humanoid' (மனித உருவ ரோபோ) என்றால் என்ன?",
      "options": ["A machine that cleans the house || வீட்டைச் சுத்தம் செய்யும் இயந்திரம்", "Something that looks like an animal || விலங்கு போலத் தோற்றமளிப்பது", "Something that looks like a human || மனிதனைப் போலவே தோற்றமளிப்பது", "A type of plant || ஒரு வகைச் செடி"],
      "answer": 2,
      "explanation": "A humanoid is a robot or entity that possesses a human-like appearance. || மனிதனைப் போன்ற தோற்றத்தைக் கொண்ட ஒரு இயந்திரமே 'ஹியூமனாய்டு' எனப்படும்."
    },
    {
      "question": "What is the meaning of 'plead'? || 'Plead' என்பதன் பொருள் என்ன?",
      "options": ["Request || வேண்டுதல் / கெஞ்சுதல்", "Reject || நிராகரித்தல்", "Command || கட்டளையிடுதல்", "Laugh || சிரித்தல்"],
      "answer": 0,
      "explanation": "To 'plead' means to make an emotional or earnest request. || 'Plead' என்பது உருக்கமாக வேண்டுவது அல்லது கெஞ்சுவதைக் குறிக்கும்."
    },
    {
      "question": "What is the meaning of 'refuse'? || 'Refuse' என்பதன் பொருள் என்ன?",
      "options": ["Accept happily || மகிழ்ச்சியுடன் ஏற்றுக்கொள்வது", "Disagree or reject || உடன்படாமல் இருப்பது அல்லது நிராகரிப்பது", "Clean thoroughly || முழுமையாகச் சுத்தம் செய்வது", "Sing a song || ஒரு பாட்டுப் பாடுவது"],
      "answer": 1,
      "explanation": "To 'refuse' means to indicate that one is not willing to do something. || 'Refuse' என்பது ஒன்றைச் செய்ய மறுப்பதாகும்."
    },
    {
      "question": "What is the meaning of 'pleasant'? || 'Pleasant' என்பதன் பொருள் என்ன?",
      "options": ["Sad || சோகமான", "Angry || கோபமான", "Happy || மகிழ்ச்சியான / இனிமையான", "Boring || சலிப்பான"],
      "answer": 2,
      "explanation": "'Pleasant' describes something that is enjoyable or happy. || 'Pleasant' என்பது மகிழ்ச்சியான அல்லது இனிமையான ஒன்றைக் குறிக்கும்."
    },
    {
      "question": "What kind of boy was Vicky at the beginning of the story? || கதையின் ஆரம்பத்தில் விக்கி எப்படிப்பட்ட சிறுவனாக இருந்தான்?",
      "options": ["An active boy || ஒரு சுறுசுறுப்பான சிறுவன்", "A smart boy || ஒரு புத்திசாலிச் சிறுவன்", "A lazy boy || ஒரு சோம்பேறிச் சிறுவன்", "A helpful boy || மற்றவர்களுக்கு உதவும் சிறுவன்"],
      "answer": 2,
      "explanation": "At the start of the story, Vicky is described as a lazy boy. || கதையின் தொடக்கத்தில் விக்கி ஒரு சோம்பேறிச் சிறுவனாக விவரிக்கப்படுகிறான்."
    },
    {
      "question": "Did Vicky do his homework on time? || விக்கி தனது வீட்டுப்பாடத்தைச் சரியான நேரத்தில் செய்தானா?",
      "options": ["Yes, always || ஆம், எப்போதும்", "Sometimes || சில நேரங்களில்", "Only when asked || மற்றவர்கள் கேட்கும்போது மட்டும்", "He never did his homework on time || அவன் ஒருபோதும் வீட்டுப்பாடத்தைச் சரியான நேரத்தில் செய்ததில்லை"],
      "answer": 3,
      "explanation": "Vicky never did his homework on time because of his laziness. || விக்கி தனது சோம்பேறித்தனத்தால் ஒருபோதும் வீட்டுப்பாடத்தைச் சரியான நேரத்தில் செய்ததில்லை."
    },
    {
      "question": "Why did Vicky plead with his father to buy a robot? || விக்கி ஏன் தனது தந்தையிடம் ரோபோ வாங்கித் தருமாறு கெஞ்சினான்?",
      "options": ["To play games with him || அவனுடன் விளையாட", "To do all his work || அவனது வேலைகளைச் செய்ய", "To go to school for him || அவனுக்காகப் பள்ளிக்குச் செல்ல", "To build other robots || மற்ற ரோபோக்களை உருவாக்க"],
      "answer": 1,
      "explanation": "Vicky wanted a robot to perform all his chores and duties. || விக்கி தனது வேலைகள் அனைத்தையும் செய்வதற்கு ஒரு ரோபோவை விரும்பினான்."
    },
    {
      "question": "Why did Vicky's father buy him a 'trick' robot? || விக்கியின் தந்தை அவனுக்கு ஏன் ஒரு 'தந்திர' ரோபோவை வாங்கினார்?",
      "options": ["Because it was cheap || அது மலிவாக இருந்ததால்", "Because he wanted Vicky to become an active boy || விக்கி ஒரு சுறுசுறுப்பான சிறுவனாக மாற வேண்டும் என்று அவர் விரும்பியதால்", "Because Vicky liked magic tricks || விக்கிக்கு மாயாஜால வித்தைகள் பிடிக்கும் என்பதால்", "Because it was the only one available || அது ஒன்றுதான் அங்கிருந்தது என்பதால்"],
      "answer": 1,
      "explanation": "His father bought a trick robot to teach Vicky a lesson and make him active. || விக்கிக்கு ஒரு பாடம் புகட்டி அவனைச் சுறுசுறுப்பாக்க அவனது தந்தை அந்த ரோபோவை வாங்கினார்."
    },
    {
      "question": "What was the robot's excuse for not making a salad? || சாலட் செய்யாததற்கு ரோபோ என்ன காரணம் கூறியது?",
      "options": ["It did not eat salad, so it could not make it || அதற்கு சாலட் பிடிக்காது, அதனால் அதைச் செய்யாது", "There were no vegetables left || அங்கு காய்கறிகள் எதுவும் இல்லை", "Its battery was dead || அதன் பேட்டரி தீர்ந்துவிட்டது", "It was too tired || அது மிகவும் சோர்வாக இருந்தது"],
      "answer": 0,
      "explanation": "The robot refused to make salad because it claimed it didn't eat salad itself. || தான் சாலட் சாப்பிடுவதில்லை, அதனால் அதைச் செய்ய முடியாது என்று ரோபோ கூறியது."
    },
    {
      "question": "What excuse did the robot give for not cleaning Vicky's room? || விக்கியின் அறையைச் சுத்தம் செய்யாததற்கு ரோபோ என்ன காரணம் கூறியது?",
      "options": ["It didn't know how to sweep || அதற்குத் துடைக்கத் தெரியாது", "It did not want to strain its back || அது தனது முதுகை வருத்திக்கொள்ள விரும்பவில்லை", "The room was already clean || அறை ஏற்கனவே சுத்தமாக இருந்தது", "It was busy making calls || அது போன் பேசுவதில் பிஸியாக இருந்தது"],
      "answer": 1,
      "explanation": "The robot said it didn't want to strain its back by cleaning the room. || அறையைச் சுத்தம் செய்து தனது முதுகிற்குச் சிரமம் கொடுக்க விரும்பவில்லை என்று ரோபோ கூறியது."
    },
    {
      "question": "Why did the robot ask Vicky to charge its battery? || தனது பேட்டரியை சார்ஜ் செய்யுமாறு ரோபோ ஏன் விக்கியைக் கேட்டது?",
      "options": ["Because it was draining by listening to Vicky || விக்கி பேசுவதைக் கேட்டு அதன் சார்ஜ் குறைந்து கொண்டிருந்ததால்", "Because it wanted to play a song || அது ஒரு பாடல் பாட விரும்பியதால்", "Because it was time for bed || அது தூங்கும் நேரம் என்பதால்", "Because the power was out || மின்சாரம் தடைபட்டதால்"],
      "answer": 0,
      "explanation": "The robot complained that listening to Vicky was draining its battery. || விக்கி பேசுவதைக் கேட்டுக்கொண்டே இருந்ததால் தன் சார்ஜ் இறங்குவதாக ரோபோ கூறியது."
    },
    {
      "question": "Who said, 'Play me a pleasant song'? || 'எனக்கு ஒரு இனிமையான பாடலை இசை' என்று கூறியது யார்?",
      "options": ["The Robot || ரோபோ", "Vicky's father || விக்கியின் தந்தை", "Vicky || விக்கி", "Nila || நிலா"],
      "answer": 2,
      "explanation": "Vicky asked the robot to play a pleasant song because he wanted to relax. || சின்று போய் ஓய்வெடுக்க விரும்பிய விக்கி, ரோபோவை ஒரு பாடல் போடுமாறு கேட்டான்."
    },
    {
      "question": "Who said, 'Clean my room now!'? || 'இப்போதே எனது அறையைச் சுத்தப்படுத்து!' என்று கூறியது யார்?",
      "options": ["Vicky || விக்கி", "The Robot || ரோபோ", "Vicky's dad || விக்கியின் அப்பா", "Anitha || அனிதா"],
      "answer": 0,
      "explanation": "Vicky commanded the robot to clean his room. || விக்கி தனது அறையைச் சுத்தப்படுத்துமாறு ரோபோவிற்கு உத்தரவிட்டான்."
    },
    {
      "question": "Who said, 'Why don't you do that yourself?'? || 'அதை நீயே ஏன் செய்யக்கூடாது?' என்று கூறியது யார்?",
      "options": ["Vicky's dad || விக்கியின் அப்பா", "Vicky || விக்கி", "The Robot || ரோபோ", "Shabeena || ஷபீனா"],
      "answer": 2,
      "explanation": "The robot said this when Vicky asked it to charge his phone. || விக்கி தனது போனை சார்ஜ் செய்யச் சொன்னபோது ரோபோ இப்படிப் பதில் அளித்தது."
    },
    {
      "question": "What did Vicky decide to do at the end of the story? || கதையின் முடிவில் விக்கி என்ன செய்ய முடிவு செய்தான்?",
      "options": ["Buy a new robot || ஒரு புதிய ரோபோவை வாங்க", "Sell the robot and do all the work himself || ரோபோவை விற்றுவிட்டு எல்லா வேலைகளையும் தானே செய்ய", "Keep the robot and remain lazy || ரோபோவை வைத்துக்கொண்டு சோம்பேறியாகவே இருக்க", "Ask his dad to do his work || தனது வேலையினைச் செய்ய அப்பாவைக் கேட்க"],
      "answer": 1,
      "explanation": "Vicky realized the importance of doing his own work and decided to sell the robot. || தனது வேலைகளைத் தானே செய்வதன் அவசியத்தை உணர்ந்த விக்கி, ரோபோவை விற்க முடிவு செய்தான்."
    },
    {
      "question": "What kind of master did the robot want to be sold to at the end? || இறுதியில் ரோபோ எவ்வகையான முதலாளியிடம் தன்னை விற்க வேண்டும் என்று கேட்டது?",
      "options": ["A lazy master || ஒரு சோம்பேறி முதலாளி", "An active master || ஒரு சுறுசுறுப்பான முதலாளி", "A sleeping master || ஒரு தூங்கும் முதலாளி", "A demanding master || எந்நேரமும் வேலை வாங்கும் முதலாளி"],
      "answer": 1,
      "explanation": "The robot requested to be sold to an active master. || ஒரு சுறுசுறுப்பான முதலாளியிடம் தன்னை விற்குமாறு ரோபோ கேட்டுக்கொண்டது."
    },
    {
      "question": "Who bought the robot for Vicky? || விக்கிக்கு ரோபோவை வாங்கித் தந்தது யார்?",
      "options": ["His mother || அவனது தாய்", "His teacher || அவனது ஆசிரியர்", "His uncle || அவனது மாமா", "His father || அவனது தந்தை"],
      "answer": 3,
      "explanation": "Vicky's father bought the trick robot to teach his son a lesson. || விக்கிக்கு ஒரு பாடம் புகட்ட அவனது தந்தை அந்த ரோபோவை வாங்கினார்."
    },
    {
      "question": "Did Vicky know it was a trick robot when he first got it? || விக்கிக்கு அந்த ரோபோ ஒரு தந்திர ரோபோ என்று ஆரம்பத்திலேயே தெரியுமா?",
      "options": ["Yes || ஆம்", "No, he did not know || இல்லை, அவனுக்குத் தெரியாது", "Yes, he read the manual || ஆம், அவன் கையேட்டைப் படித்திருந்தான்", "Yes, the robot told him || ஆம், ரோபோ அவனிடம் சொன்னது"],
      "answer": 1,
      "explanation": "Vicky initially believed it was a normal robot that would do his work. || விக்கி முதலில் அது தனது வேலைகளைச் செய்யும் ஒரு சாதாரண ரோபோ என்றே நினைத்தான்."
    },
    {
      "question": "What is a naming word used for one person or thing called? || ஒரு நபர் அல்லது ஒரு பொருளைக் குறிக்கும் சொல் எவ்வாறு அழைக்கப்படுகிறது?",
      "options": ["Plural || பன்மை", "Adjective || பெயரடை", "Singular || ஒருமை", "Verb || வினைச்சொல்"],
      "answer": 2,
      "explanation": "'Singular' refers to one person, place, or thing. || ஒரு பொருளை மட்டும் குறிப்பது 'ஒருமை' (Singular) ஆகும்."
    },
    {
      "question": "What is a naming word that denotes more than one person or thing called? || ஒன்றுக்கு மேற்பட்ட நபர்கள் அல்லது பொருட்களைக் குறிக்கும் சொல் எவ்வாறு அழைக்கப்படுகிறது?",
      "options": ["Singular || ஒருமை", "Common Noun || பொதுப் பெயர்ச்சொல்", "Proper Noun || சிறப்புப் பெயர்ச்சொல்", "Plural || பன்மை"],
      "answer": 3,
      "explanation": "'Plural' refers to more than one person, place, or thing. || ஒன்றுக்கும் மேற்பட்ட பொருட்களைக் குறிப்பது 'பன்மை' (Plural) ஆகும்."
    },
    {
      "question": "What is the plural form of 'Cup'? || 'Cup' என்பதன் பன்மை வடிவம் என்ன?",
      "options": ["Cupes", "Cups", "Cupies", "Cup"],
      "answer": 1,
      "explanation": "For most words, we simply add 's' to form the plural. || பெரும்பாலான சொற்களுக்கு இறுதியில் 's' சேர்த்தால் பன்மை உருவாகும்."
    },
    {
      "question": "What is the plural form of 'Torch'? || 'Torch' என்பதன் பன்மை வடிவம் என்ன?",
      "options": ["Torchs", "Torchies", "Torches", "Torch"],
      "answer": 2,
      "explanation": "Words ending in 'ch' take 'es' in the plural form. || 'ch' இல் முடியும் சொற்களுக்கு இறுதியில் 'es' சேர்க்க வேண்டும்."
    },
    {
      "question": "What is the plural form of 'Brush'? || 'Brush' என்பதன் பன்மை வடிவம் என்ன?",
      "options": ["Brushs", "Brushes", "Brushies", "Brush"],
      "answer": 1,
      "explanation": "Words ending in 'sh' take 'es' in the plural form. || 'sh' இல் முடியும் சொற்களுக்கு இறுதியில் 'es' சேர்க்க வேண்டும்."
    },
    {
      "question": "What is the plural form of 'Glass'? || 'Glass' என்பதன் பன்மை வடிவம் என்ன?",
      "options": ["Glasss", "Glasses", "Glassies", "Glass"],
      "answer": 1,
      "explanation": "Words ending in 'ss' take 'es' in the plural form. || 'ss' இல் முடியும் சொற்களுக்கு இறுதியில் 'es' சேர்க்க வேண்டும்."
    },
    {
      "question": "What is the plural form of 'Key'? || 'Key' என்பதன் பன்மை வடிவம் என்ன?",
      "options": ["Keyes", "Keyies", "Keys", "Key"],
      "answer": 2,
      "explanation": "If a vowel comes before 'y', we just add 's'. || 'y' க்கு முன்னால் உயிர் எழுத்து (vowel) இருந்தால் 's' மட்டும் சேர்க்க வேண்டும்."
    },
    {
      "question": "What is the plural form of 'Lady'? || 'Lady' என்பதன் பன்மை வடிவம் என்ன?",
      "options": ["Ladys", "Ladyies", "Ladies", "Ladyes"],
      "answer": 2,
      "explanation": "If a vowel does not come before 'y', change 'y' to 'ies'. || 'y' க்கு முன்னால் உயிர் எழுத்து இல்லை என்றால் 'y' ஐ நீக்கி 'ies' சேர்க்க வேண்டும்."
    },
    {
      "question": "What is the plural form of 'Fly'? || 'Fly' என்பதன் பன்மை வடிவம் என்ன?",
      "options": ["Flys", "Flies", "Flyies", "Flyes"],
      "answer": 1,
      "explanation": "The 'y' changes to 'ies' because it follows a consonant 'l'. || 'y' க்கு முன்னால் மெய் எழுத்து (l) இருப்பதால், 'y' நீக்கப்பட்டு 'ies' சேர்க்கப்படுகிறது."
    },
    {
      "question": "What is the plural form of 'Bench'? || 'Bench' என்பதன் பன்மை வடிவம் என்ன?",
      "options": ["Benchs", "Benchies", "Benches", "Bench"],
      "answer": 2,
      "explanation": "Words ending in 'ch' take 'es' in the plural. || 'ch' இல் முடியும் சொற்களுக்கு இறுதியில் 'es' சேர்க்க வேண்டும்."
    },
    {
      "question": "What is the plural form of 'Boy'? || 'Boy' என்பதன் பன்மை வடிவம் என்ன?",
      "options": ["Boies", "Boyes", "Boys", "Boyies"],
      "answer": 2,
      "explanation": "Since a vowel 'o' comes before 'y', we just add 's'. || 'y' க்கு முன் 'o' என்ற உயிர் எழுத்து இருப்பதால் 's' மட்டும் சேர்க்கப்படுகிறது."
    },
    {
      "question": "What is the plural form of 'Catch'? || 'Catch' என்பதன் பன்மை வடிவம் என்ன?",
      "options": ["Catchs", "Catchies", "Catches", "Catch"],
      "answer": 2,
      "explanation": "Words ending in 'ch' take 'es'. || 'ch' இல் முடியும் சொற்களுக்கு இறுதியில் 'es' சேர்க்க வேண்டும்."
    },
    {
      "question": "What is the plural form of 'Berry'? || 'Berry' என்பதன் பன்மை வடிவம் என்ன?",
      "options": ["Berrys", "Berries", "Berryes", "Beries"],
      "answer": 1,
      "explanation": "The 'y' changes to 'ies' because 'r' is a consonant. || 'y' க்கு முன் 'r' என்ற மெய் எழுத்து இருப்பதால் 'y' மாறி 'ies' ஆகிறது."
    },
    {
      "question": "What is the plural form of 'Dish'? || 'Dish' என்பதன் பன்மை வடிவம் என்ன?",
      "options": ["Dishs", "Dishes", "Dishies", "Dish"],
      "answer": 1,
      "explanation": "Words ending in 'sh' take 'es'. || 'sh' இல் முடியும் சொற்களுக்கு இறுதியில் 'es' சேர்க்க வேண்டும்."
    },
    {
      "question": "In the poem 'My Robot', what two words describe the robot's size and strength? || 'எனது ரோபோ' கவிதையில் அதன் அளவையும் பலத்தையும் குறிக்கும் இரு சொற்கள் எவை?",
      "options": ["Short and weak || குட்டையான மற்றும் பலவீனமான", "Big and strong || பெரிய மற்றும் பலமான", "Small and fast || சிறிய மற்றும் வேகமான", "Tall and heavy || உயரமான மற்றும் கனமான"],
      "answer": 1,
      "explanation": "The poem describes the robot as 'big and strong'. || கவிதையின் முதல் வரியிலேயே ரோபோ பெரியது மற்றும் பலமானது என்று கூறப்படுகிறது."
    },
    {
      "question": "According to the poem, how does the robot walk along? || கவிதையின்படி ரோபோ எவ்வாறு நடந்து வரும்?",
      "options": ["With a heavy footstep || கனமான காலடிகளுடன்", "With a nice rhyming song || ஒரு இனிமையான இயைபுப் பாடலுடன்", "With a loud beep || ஒரு சத்தமான பீப் ஒலியுடன்", "With a fast run || வேகமாக ஓடி வரும்"],
      "answer": 1,
      "explanation": "The robot walks along with a nice rhyming song. || ரோபோ ஒரு இனிமையான இயைபுக் கவிதையைப் பாடிக்கொண்டே நடந்து வரும்."
    },
    {
      "question": "How does the robot welcome all? || ரோபோ அனைவரையும் எவ்வாறு வரவேற்கும்?",
      "options": ["With a warm hug || கட்டிப்பிடித்து", "With a handshake || கைகுலுக்கி", "With a nice greeting call || ஒரு நல்ல வாழ்த்து அழைப்போடு", "By offering food || உணவை வழங்கி"],
      "answer": 2,
      "explanation": "The robot welcomes all with a nice greeting call. || ரோபோ அனைவரையும் ஒரு இனிமையான வரவேற்பு அழைப்போடு வரவேற்கும்."
    },
    {
      "question": "How do the robot's wheels go in the poem? || கவிதையில் ரோபோவின் சக்கரங்கள் எவ்வாறு நகர்கின்றன?",
      "options": ["Front and back || முன்னும் பின்னும்", "Left and right || இடமும் வலமும்", "Up and down || மேலேயும் கீழேயும்", "Round and round || வட்டமாகச் சுற்றி"],
      "answer": 0,
      "explanation": "The robot's wheels move front and back. || ரோபோவின் சக்கரங்கள் முன்னும் பின்னும் நகரும் என்று கவிதை கூறுகிறது."
    },
    {
      "question": "Where does the robot keep the sack? || ரோபோ சாக்குப் பைகளை எங்கே வைக்கும்?",
      "options": ["On the floor || தரையில்", "In every little rack || ஒவ்வொரு சிறிய அடுக்கிலும்", "In the cupboard || அலமாரியில்", "Outside the door || கதவிற்கு வெளியே"],
      "answer": 1,
      "explanation": "The robot keeps the sack in every little rack. || ரோபோ சாக்குகளை ஒவ்வொரு அடுக்கிலும் (rack) அடுக்கி வைக்கும்."
    },
    {
      "question": "What does the robot never take? || ரோபோ எதை ஒருபோதும் எடுத்துக்கொள்வது இல்லை?",
      "options": ["Food and rest || உணவு மற்றும் ஓய்வு", "Water and air || நீர் மற்றும் காற்று", "Oil and battery || எண்ணெய் மற்றும் பேட்டரி", "Breaks and naps || இடைவேளை மற்றும் தூக்கம்"],
      "answer": 0,
      "explanation": "The robot never needs food or rest to work. || ரோபோவிற்கு வேலை செய்ய உணவோ அல்லது ஓய்வோ தேவையில்லை."
    },
    {
      "question": "What is the rhyming word for 'tall' in the poem? || கவிதையில் 'tall' என்ற சொல்லிற்கு இயைபுச் சொல் (rhyming word) எது?",
      "options": ["Best", "Rack", "All", "Along"],
      "answer": 2,
      "explanation": "'tall' rhymes with 'all' in the poem. || 'tall' மற்றும் 'all' ஆகிய இரண்டு சொற்களும் ஒரே மாதிரியான ஓசையைக் கொண்டுள்ளன."
    },
    {
      "question": "What is the rhyming word for 'rest' in the poem? || கவிதையில் 'rest' என்ற சொல்லிற்கு இயைபுச் சொல் எது?",
      "options": ["Sack", "Best", "Song", "Tall"],
      "answer": 1,
      "explanation": "'rest' rhymes with 'best' in the poem. || 'rest' மற்றும் 'best' ஆகிய இரண்டு சொற்களும் ஒரே மாதிரியான ஓசையைக் கொண்டுள்ளன."
    },
    {
      "question": "What type of noun denotes a person in general? || பொதுவாக ஒரு நபரைக் குறிக்கும் பெயர்ச்சொல் எது?",
      "options": ["Proper noun || சிறப்புப் பெயர்ச்சொல்", "Common noun || பொதுப் பெயர்ச்சொல்", "Adjective || பெயரடை", "Pronoun || பிரதிப் பெயர்ச்சொல்"],
      "answer": 1,
      "explanation": "A common noun denotes a person or thing in general. || ஒரு பொதுவான பிரிவைக் குறிப்பது 'பொதுப் பெயர்ச்சொல்' (Common Noun) ஆகும்."
    },
    {
      "question": "What type of noun denotes a person in particular? || ஒரு குறிப்பிட்ட நபரைக் குறிக்கும் பெயர்ச்சொல் எது?",
      "options": ["Common noun || பொதுப் பெயர்ச்சொல்", "Proper noun || சிறப்புப் பெயர்ச்சொல்", "Verb || வினைச்சொல்", "Adverb || வினையுரிச்சொல்"],
      "answer": 1,
      "explanation": "A proper noun denotes a person or thing in particular. || ஒரு குறிப்பிட்ட பெயரைத் தெரிவிப்பது 'சிறப்புப் பெயர்ச்சொல்' (Proper Noun) ஆகும்."
    },
    {
      "question": "Which of the following is a common noun? || கீழே உள்ளவற்றில் எது பொதுப் பெயர்ச்சொல்?",
      "options": ["Pooja", "Nethra", "girl", "Arun"],
      "answer": 2,
      "explanation": "'girl' is a general naming word, so it is a common noun. || 'Pooja', 'Nethra', 'Arun' என்பவை குறிப்பிட்ட பெயர்கள்; 'girl' என்பது பொதுவானது."
    },
    {
      "question": "Which of the following is a proper noun? || கீழே உள்ளவற்றில் எது சிறப்புப் பெயர்ச்சொல்?",
      "options": ["city", "Chennai", "boy", "animal"],
      "answer": 1,
      "explanation": "'Chennai' is a specific name of a city, making it a proper noun. || 'Chennai' என்பது ஒரு குறிப்பிட்ட இடத்தைக் குறிப்பதால் அது சிறப்புப் பெயர்ச்சொல் ஆகும்."
    },
    {
      "question": "Find the odd one out: city, boy, book, Chennai || பொருந்தாத ஒன்றைக் கண்டுபிடி: city, boy, book, Chennai",
      "options": ["city", "boy", "book", "Chennai"],
      "answer": 3,
      "explanation": "'Chennai' is a proper noun, while others are common nouns. || மற்ற மூன்றும் பொதுப் பெயர்ச்சொற்கள், சென்னை என்பது மட்டும் சிறப்புப் பெயர்ச்சொல்."
    },
    {
      "question": "Find the odd one out: Karikalan, Paari, Kumaran, king || பொருந்தாத ஒன்றைக் கண்டுபிடி: கரிகாலன், பாரி, குமரன், அரசன்",
      "options": ["Karikalan", "Paari", "Kumaran", "king"],
      "answer": 3,
      "explanation": "'king' is a common noun, while the others are specific names. || மற்ற மூன்றும் குறிப்பிட்ட பெயர்கள், அரசன் என்பது பொதுவான பெயர்."
    },
    {
      "question": "Find the odd one out: mango, banana, fruit, apple || பொருந்தாத ஒன்றைக் கண்டுபிடி: மாம்பழம், வாழைப்பழம், பழம், ஆப்பிள்",
      "options": ["mango", "banana", "fruit", "apple"],
      "answer": 2,
      "explanation": "'fruit' is the general category (common noun). || மற்றவை குறிப்பிட்ட பழங்கள், 'பழம்' என்பது பொதுவான சொல்."
    },
    {
      "question": "Where did Anitha go with her excitement? || அனிதா உற்சாகத்துடன் எங்கு சென்றாள்?",
      "options": ["A book fair || புத்தகக் கண்காட்சி", "A dance program || நடன நிகழ்ச்சி", "Robot Expo || ரோபோ கண்காட்சி", "A vacation || சுற்றுலா"],
      "answer": 2,
      "explanation": "Anitha visited a Robot Expo during her holidays. || அனிதா தனது விடுமுறை நாட்களில் ரோபோ கண்காட்சிக்குச் சென்றாள்."
    },
    {
      "question": "Who welcomed Anitha into the hall at the expo? || கண்காட்சி கூடத்திற்குள் அனிதாவை வரவேற்றது யார்?",
      "options": ["A security guard || ஒரு பாதுகாப்புக் காவலர்", "A humanoid || ஒரு மனித உருவ ரோபோ", "A dog robot || ஒரு நாய் ரோபோ", "Her friends || அவளது நண்பர்கள்"],
      "answer": 1,
      "explanation": "A humanoid welcomed visitors and knew Anitha's name. || அனிதாவை ஒரு 'ஹியூமனாய்டு' வரவேற்றது மற்றும் அவளது பெயரையும் அது கூறியது."
    },
    {
      "question": "What kind of robot suddenly sat on Anitha's shoulder? || அனிதாவின் தோளில் திடீரென்று அமர்ந்த ரோபோ எது?",
      "options": ["A dragonfly robot || ஒரு தும்பி ரோபோ", "An ant robot || ஒரு எறும்பு ரோபோ", "A butterfly robot || ஒரு பட்டாம்பூச்சி ரோபோ", "A puppy robot || ஒரு நாய் குட்டி ரோபோ"],
      "answer": 2,
      "explanation": "A butterfly robot came and sat on Anitha's shoulder. || ஒரு பட்டாம்பூச்சி ரோபோ வந்து அனிதாவின் தோளில் அமர்ந்தது."
    },
    {
      "question": "What dish did the cooking robot serve Anitha? || சமையல் ரோபோ அனிதாவிற்கு என்ன உணவை வழங்கியது?",
      "options": ["A salad || சாலட்", "An omelette || ஆம்லெட்", "A bowl of soup || சூப்", "A slice of cake || கேக் துண்டு"],
      "answer": 1,
      "explanation": "The cooking robot served Anitha an omelette. || சமையல் ரோபோ அனிதாவிற்கு ஒரு ஆம்லெட் சமைத்துப் பரிமாறியது."
    },
    {
      "question": "What did the robot that dropped the empty water bottle advise everyone to do? || காலியான தண்ணீர் பாட்டிலை மீட்டெடுத்த ரோபோ அனைவருக்கும் என்ன அறிவுரை கூறியது?",
      "options": ["Keep silence || அமைதி காக்கவும்", "Wash hands || கைகளைச் கழுவவும்", "Use dustbin || குப்பைத் தொட்டியைப் பயன்படுத்தவும்", "Don't spit || எச்சில் துப்ப வேண்டாம்"],
      "answer": 2,
      "explanation": "The robot advised everyone to use the dustbin to keep the place clean. || குப்பையைத் தொட்டியில் போட வேண்டும் என்று ரோபோ அறிவுரை கூறியது."
    },
    {
      "question": "According to the expo, what part acts as the brain of a robot? || கண்காட்சியின்படி, ரோபோவின் மூளையாகச் செயல்படும் பாகம் எது?",
      "options": ["The mechanical part || இயந்திர பாகம்", "The camera || கேமரா", "The sensor || சென்சார்", "The controller || கட்டுப்படுத்தி (கண்ட்ரோலர்)"],
      "answer": 3,
      "explanation": "The controller acts as the brain of the robot. || ஒரு ரோபோவிற்கு அதன் கட்டுப்படுத்தியே (Controller) மூளையாகச் செயல்படுகிறது."
    },
    {
      "question": "What is the use of the mechanical parts in a robot? || ரோபோவில் உள்ள இயந்திர பாகங்களின் பயன் என்ன?",
      "options": ["It acts as the brain || மூளையாகச் செயல்படுகிறது", "It helps the robot sense walls || சுவர்களைக் கண்டறிய உதவுகிறது", "It helps the robot move || ரோபோ நகர உதவுகிறது", "It cooks food || உணவு சமைக்கிறது"],
      "answer": 2,
      "explanation": "Mechanical parts are necessary for the robot to move. || இயந்திர பாகங்களே ஒரு ரோபோ நகர்வதற்கு உதவுகின்றன."
    },
    {
      "question": "In the reading passage, on what day does the robot help its master get ready? || வாசிப்புப் பகுதியில், வாரத்தின் எந்த நாளில் ரோபோ அதன் முதலாளிக்கு உதவுகிறது?",
      "options": ["Sunday || ஞாயிறு", "Monday || திங்கள்", "Tuesday || செவ்வாய்", "Friday || வெள்ளி"],
      "answer": 1,
      "explanation": "The passage describes the robot's morning routine on Monday. || அந்தப் பகுதியில் திங்கட்கிழமை காலையில் ரோபோ செய்யும் வேலைகள் விவரிக்கப்பட்டுள்ளன."
    },
    {
      "question": "Where did the robot safely keep the master's car key? || ரோபோ அதன் முதலாளியின் கார் சாவியை எங்கே பாதுகாப்பாக வைத்தது?",
      "options": ["In the master's pocket || முதலாளியின் பாக்கெட்டில்", "On the kitchen table || சமையலறை மேஜையில்", "In the lunch box || மதிய உணவு பெட்டியில்", "Inside the car || காருக்குள்"],
      "answer": 2,
      "explanation": "The robot kept the car key inside the master's lunch box. || ரோபோ கார் சாவியை மதிய உணவுப் பெட்டிக்குள் வைத்திருந்தது."
    }
  ]
}

file_path = r'c:\Users\MATHAN\2026-SPECIAL-EXAM\PAPER 1\json-db\lessons\english\4\eng_4_t1_l1.json'

with open(file_path, 'r', encoding='utf-8') as f:
    lesson_data = json.load(f)

# Replace the existing questions with the new ones
lesson_data['quiz']['questions'] = new_quiz_data['questions']

with open(file_path, 'w', encoding='utf-8') as f:
    json.dump(lesson_data, f, ensure_ascii=False, indent=2)

print("Successfully updated quiz questions with bilingual content.")
