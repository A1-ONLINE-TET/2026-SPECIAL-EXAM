
import json
import os

new_quiz_questions = [
    {
      "question": "What is the full form of 'DIY' mentioned in the text? || பாடத்தில் குறிப்பிடப்பட்டுள்ள 'DIY' என்பதன் விரிவாக்கம் என்ன?",
      "options": ["Draw It Yourself", "Design It Yourself", "Do It Yourself || நீயே செய்", "Do It Yesterday"],
      "answer": 2,
      "explanation": "DIY stands for 'Do It Yourself', which refers to children who do their tasks on their own. || 'DIY' என்பது 'Do It Yourself' (நீயே செய்) என்பதைக் குறிக்கும்; இது தனது வேலைகளைத் தானே செய்யும் குழந்தைகளைக் குறிக்கிறது."
    },
    {
      "question": "Who introduces himself as a 'DIY kid' in the text? || பாடத்தில் தன்னை ஒரு 'DIY சிறுவன்' என்று அறிமுகப்படுத்திக் கொள்பவர் யார்?",
      "options": ["Raju", "James", "Vinoth || வினோத்", "Madhan"],
      "answer": 2,
      "explanation": "Vinoth says, 'I am a DIY kid' because he handles his own chores. || வினோத் தனது வேலைகளைத் தானே செய்துகொள்வதால், தன்னை ஒரு 'DIY சிறுவன்' என்று கூறுகிறான்."
    },
    {
      "question": "What chores does Vinoth do on his own? || வினோத் தனது வேலைகளில் எதைத் தானே செய்கிறான்?",
      "options": ["Washes and folds his clothes neatly || தனது துணிகளைத் துவைத்து நேர்த்தியாக மடிக்கிறான்", "Cooks dinner for the family", "Waters the garden every day", "Hems the borders of clothes"],
      "answer": 0,
      "explanation": "Vinoth washes and folds his own clothes neatly. || வினோத் தனது துணிகளைத் தானே துவைத்து மடித்து வைக்கிறான்."
    },
    {
      "question": "What is Rosy's hobby? || ரோஸியின் பொழுதுபோக்கு என்ன?",
      "options": ["Swimming", "Cycling || மிதிவண்டி ஓட்டுதல்", "Cooking", "Gardening"],
      "answer": 1,
      "explanation": "Rosy enjoys cycling and rides her bicycle every day. || ரோஸிக்கு மிதிவண்டி ஓட்டுவது பிடிக்கும்; அவள் தினமும் அதை ஓட்டுகிறாள்."
    },
    {
      "question": "At what age did Rosy learn to ride a bicycle? || ரோஸி எந்த வயதில் மிதிவண்டி ஓட்டக் கற்றுக்கொண்டாள்?",
      "options": ["7 years old", "8 years old", "9 years old || 9 வயதில்", "10 years old"],
      "answer": 2,
      "explanation": "Rosy learnt to ride a bicycle when she was 9 years old. || ரோஸி தனது 9 வயதில் மிதிவண்டி ஓட்டக் கற்றுக்கொண்டாள்."
    },
    {
      "question": "What activity is Megalai fond of? || மேகலை விரும்பிச் செய்யும் செயல் எது?",
      "options": ["Cycling", "Hemming", "Swimming || நீச்சல்", "Angling"],
      "answer": 2,
      "explanation": "Megalai is fond of swimming and competes with elders in the well. || மேகலைக்கு நீச்சல் பிடிக்கும்; அவள் மற்றவர்களுடன் போட்டியிட்டு நீந்துவாள்."
    },
    {
      "question": "Where does Megalai usually swim? || மேகலை பொதுவாக எங்கே நீந்துவாள்?",
      "options": ["In a well || கிணற்றில்", "In a river", "In a swimming pool", "In the ocean"],
      "answer": 0,
      "explanation": "The text states that Megalai swims with elders in a well. || மேகலை கிணற்றில் பெரியவர்களுடன் நீந்துவாள் என்று பாடம் கூறுகிறது."
    },
    {
      "question": "According to the story, who is good at cooking? || கதையின்படி சமையலில் சிறந்தவர் யார்?",
      "options": ["Megalai", "Vinoth", "James", "Raju || ராஜு"],
      "answer": 3,
      "explanation": "Raju is the one who is good at cooking and helps in the kitchen. || ராஜு சமையல் செய்வதில் சிறந்தவன் மற்றும் சமையலறையில் உதவுகிறான்."
    },
    {
      "question": "Whose hobby is gardening? || தோட்டக்கலை யாருடைய பொழுதுபோக்கு?",
      "options": ["Aliya", "James || ஜேம்ஸ்", "Rosy", "Raju"],
      "answer": 1,
      "explanation": "James is interested in gardening and waters his plants every day. || ஜேம்ஸ் தோட்டக்கலையில் ஆர்வம் உள்ளவன்; செடிகளுக்குத் தினமும் நீர் ஊற்றுவான்."
    },
    {
      "question": "Who hems the border of the cloth? || துணியின் ஓரத்தை மடித்துத் தைப்பவர் யார்?",
      "options": ["Megalai", "James", "Aliya || அலியா", "Rosy"],
      "answer": 2,
      "explanation": "Aliya is the character who hems the border of her own clothes. || அலியா தனது துணிகளின் ஓரத்தைத் தானே மடித்துத் தைப்பாள்."
    },
    {
      "question": "According to the Pictionary, what is a 'Mermaid'? || 'கடல் கன்னி' (Mermaid) என்றால் என்ன?",
      "options": ["A worm in the ground", "A person who fishes", "A mythological creature with a woman's head and fish tail || பெண்ணின் தலையையும் மீனின் வாலையும் கொண்ட ஒரு கற்பனை உயிரினம்", "A baby fish"],
      "answer": 2,
      "explanation": "A mermaid is an imaginary creature with a human upper body and a fish tail. || கடல் கன்னி என்பது பெண்ணின் உடலையும் மீனின் வாலையும் கொண்ட ஒரு கற்பனை உயிரினம்."
    },
    {
      "question": "What do we call a worm that lives in the ground? || மண்ணிற்கு அடியில் வாழும் புழுவை நாம் எவ்வாறு அழைக்கிறோம்?",
      "options": ["Fry", "Earthworm || மண்புழு", "Mermaid", "Angler"],
      "answer": 1,
      "explanation": "An earthworm is a worm that lives in the ground. || மண்புழு என்பது மண்ணில் வாழும் ஒரு வகைப் புழுவாகும்."
    },
    {
      "question": "What is the vocabulary term for 'fishing with a rod and line'? || தூண்டில் கொண்டு மீன் பிடிப்பதைக் குறிக்கும் சொல் எது?",
      "options": ["Angling || தூண்டில் இடுதல்", "Hemming", "Cycling", "Frying"],
      "answer": 0,
      "explanation": "Angling is defined as the act of fishing with a rod and line. || தூண்டில் மற்றும் கயிறு கொண்டு மீன் பிடிப்பது 'Angling' எனப்படும்."
    },
    {
      "question": "What does the verb 'Hem' mean in the given text? || பாடத்தில் 'Hem' என்ற வினைச்சொல்லின் பொருள் என்ன?",
      "options": ["To ride a bicycle", "To swim in a well", "To cook food", "To fold and sew the edge of a cloth || துணியின் ஓரத்தை மடித்துத் தைத்தல்"],
      "answer": 3,
      "explanation": "'Hem' means searching, folding, and sewing the edge of a cloth. || 'Hem' என்பது ஒரு துணியின் விளிம்புகளை மடித்துத் தைப்பதைக் குறிக்கும்."
    },
    {
      "question": "What is the meaning of the word 'Fry' in the Pictionary? || விளக்கப்பட அகராதியின்படி 'Fry' என்பதன் பொருள் என்ன?",
      "options": ["Cooking food", "Baby of a fish || மீன் குஞ்சு", "A fishing rod", "A mermaid"],
      "answer": 1,
      "explanation": "In this context, 'Fry' refers to a baby fish. || இந்த இடத்தில் 'Fry' என்பது மீன் குஞ்சைக் குறிக்கிறது."
    },
    {
      "question": "Which of the following is described as a 'mythological creature'? || கீழே உள்ளவற்றில் எது 'கற்பனை உயிரினம்' (mythological creature) என்று விவரிக்கப்படுகிறது?",
      "options": ["Earthworm", "Mermaid || கடல் கன்னி", "Fry", "Angling"],
      "answer": 1,
      "explanation": "A mermaid is a mythological (imaginary) creature. || கடல் கன்னி என்பது மக்களின் கற்பனையில் உருவான ஒரு உயிரினம்."
    },
    {
      "question": "Which tool is primarily used in the activity of 'Angling'? || 'தூண்டில் இடுதல்' (Angling) செயலுக்குப் பயன்படும் கருவி எது?",
      "options": ["A needle and thread", "A bicycle", "A rod and line || ஒரு தூண்டில் மற்றும் கயிறு", "A frying pan"],
      "answer": 2,
      "explanation": "Angling involves catching fish using a rod and line. || தூண்டில் மற்றும் மீன்பிடி கயிறு கொண்டு மீன் பிடிக்கப்படுகிறது."
    },
    {
      "question": "Where does an earthworm primarily live? || மண்புழு எங்கே பெரும்பாலும் வாழும்?",
      "options": ["In a well", "In the ocean", "In the ground || மண்ணில்", "On a bicycle"],
      "answer": 2,
      "explanation": "Earthworms live below the surface of the ground. || மண்புழுக்கள் மண்ணிற்கு அடியில் வாழ்கின்றன."
    },
    {
      "question": "If someone is folding and sewing the edge of their dress, what are they doing? || ஒருவர் தனது ஆடையின் ஓரம் மடித்துத் தைக்கிறார் என்றால் அவர் என்ன செய்கிறார்?",
      "options": ["Angling", "Hemming || ஓரம் தைத்தல்", "Gardening", "Cooking"],
      "answer": 1,
      "explanation": "Folding and sewing the edge of clothing is called hemming. || துணியின் விளிம்புகளை மடித்துத் தைப்பது 'Hemming' எனப்படும்."
    },
    {
      "question": "A baby fish is referred to as a _______. || மீனின் குஞ்சு எவ்வாறு அழைக்கப்படுகிறது?",
      "options": ["Kid", "Mermaid", "Fry || மீன் குஞ்சு", "Worm"],
      "answer": 2,
      "explanation": "The correct term for a baby fish in this lesson is 'fry'. || பாடத்தின்படி மீன் குஞ்சு என்பது 'fry' என்று அழைக்கப்படுகிறது."
    },
    {
      "question": "Which of the following is a correct pair of homophones? || கீழே உள்ளவற்றில் சரியான 'ஒத்த ஒலிப்புச் சொற்கள்' இணை எது?",
      "options": ["mars - cars", "blue - blew || நீலம் - ஊதியது", "time - crime", "head - bed"],
      "answer": 1,
      "explanation": "'Blue' and 'blew' sound the same but have different meanings and spellings. || 'Blue' (நீலம்) மற்றும் 'blew' (ஊதியது) ஆகிய இரண்டும் ஒரே ஒலியைக் கொண்டுள்ளன."
    },
    {
      "question": "Which word is a homophone for the word 'hair'? || 'Hair' (முடி) என்ற சொல்லிற்குரிய ஒத்த ஒலிச் சொல் எது?",
      "options": ["hare || முயல்", "hear", "here", "air"],
      "answer": 0,
      "explanation": "'Hare' (a rabbit-like animal) and 'hair' are homophones. || 'Hare' (முயல் வகை) மற்றும் 'hair' (முடி) ஆகியவை ஒரே மாதிரி ஒலிக்கக்கூடியவை."
    },
    {
      "question": "What is the correct homophone for the word 'read'? || 'Read' (வாசித்தல்) என்ற சொல்லிற்குரிய ஒத்த ஒலிச் சொல் எது?",
      "options": ["red", "reed || நாணல்", "ride", "rod"],
      "answer": 1,
      "explanation": "The text pairs 'Reed' and 'Read' together. || 'Read' மற்றும் 'Reed' ஆகியவை ஒத்த ஒலிப்புச் சொற்கள்."
    },
    {
      "question": "Fill in: 'The sky is very clear and _______ today.' || 'வானம் இன்று மிகவும் தெளிவாகவும் _______ ஆகவும் இருக்கிறது.'",
      "options": ["blew", "blow", "blue || நீல நிறம்", "blues"],
      "answer": 2,
      "explanation": "'Blue' refers to the color of the clear sky. || இங்கே 'Blue' என்பது வானத்தின் நிறத்தைக் குறிக்கிறது."
    },
    {
      "question": "Fill in: 'The strong wind _______ away the dry leaves.' || 'பலமான காற்று காய்ந்த இலைகளை _______.'",
      "options": ["blue", "blow", "blown", "blew || ஊதிச் சென்றது"],
      "answer": 3,
      "explanation": "'Blew' is the past tense of blow, used for winds. || 'Blew' என்பது காற்று வீசுவதைக் குறிக்கும் வினைச்சொல்."
    },
    {
      "question": "Fill in: 'I have to _______ this storybook.' || 'நான் இந்தப் புத்தகத்தை _______ வேண்டும்.'",
      "options": ["reed", "read || வாசிக்க", "red", "rid"],
      "answer": 1,
      "explanation": "'Read' means to look at and understand text. || புத்தகத்தைப் படிப்பதைக் குறிக்க 'read' என்ற சொல் பயன்படுகிறது."
    },
    {
      "question": "Fill in: 'The musical instrument has a small _______ inside.' || 'இசைக்கருவியின் உள்ளே ஒரு சிறிய _______ இருக்கிறது.'",
      "options": ["read", "red", "reed || நாணல்", "ride"],
      "answer": 2,
      "explanation": "A 'reed' is a thin material used in some instruments to make sound. || 'Reed' என்பது குழல் வகை இசைக்கருவிகளில் ஓசை எழுப்பப் பயன்படும் ஒரு மெல்லிய தண்டு."
    },
    {
      "question": "Fill in: 'My sister has long black _______.' || 'எனது சகோதரிக்கு நீண்ட கருமையான _______ இருக்கிறது.'",
      "options": ["hare", "air", "hair || முடி", "heir"],
      "answer": 2,
      "explanation": "'Hair' refers to the strands on the human skin. || இங்கே 'Hair' என்பது கூந்தலைக் குறிக்கிறது."
    },
    {
      "question": "Fill in: 'The tortoise won the race against the fast _______.' || 'ஆமை அந்த வேகமான _______ க்கு எதிரான பந்தயத்தில் வெற்றி பெற்றது.'",
      "options": ["hair", "hare || முயல்", "here", "hear"],
      "answer": 1,
      "explanation": "A 'hare' is the fast animal from the story. || கதையில் வரும் வேகமான முயல் போன்ற விலங்கு 'Hare' எனப்படும்."
    },
    {
      "question": "What are words called that sound the same but have different meanings? || ஒரே ஒலியில் ஒலிக்கும் ஆனால் வேறுபட்ட பொருளைக் கொண்ட சொற்கள் எவ்வாறு அழைக்கப்படுகின்றன?",
      "options": ["Synonyms", "Antonyms", "Rhyming words", "Homophones || ஒத்த ஒலிப்புச் சொற்கள்"],
      "answer": 3,
      "explanation": "Words that sound identical but differ in meaning/spelling are homophones. || அவை 'ஒத்த ஒலிப்புச் சொற்கள்' (Homophones) எனப்படும்."
    },
    {
      "question": "Which word correctly rhymes with 'mars' in the text? || 'mars' என்ற சொல்லிற்கு இயைபுச் சொல் எது?",
      "options": ["stars", "crime", "cars || கார்கள்", "time"],
      "answer": 2,
      "explanation": "In the poem, 'mars' rhymes with 'cars'. || கவிதையில் 'mars' மற்றும் 'cars' இயைபுச் சொற்களாக வருகின்றன."
    },
    {
      "question": "Which word correctly rhymes with 'time'? || 'time' என்ற சொல்லிற்கு இயைபுச் சொல் எது?",
      "options": ["chime", "crime || குற்றம்", "head", "bed"],
      "answer": 1,
      "explanation": "'Time' rhymes with 'crime' in the exercise. || 'Time' மற்றும் 'crime' ஆகியவை இயைபுச் சொற்கள்."
    },
    {
      "question": "Which word correctly rhymes with 'bed'? || 'bed' என்ற சொல்லிற்கு இயைபுச் சொல் எது?",
      "options": ["red", "head || தலை", "time", "mars"],
      "answer": 1,
      "explanation": "'Bed' rhymes with 'head' in the poem. || 'Bed' மற்றும் 'head' ஆகியவை இயைபுச் சொற்கள்."
    },
    {
      "question": "According to the poem, a glance at history takes you back in _______. || கவிதையின்படி, வரலாற்றைப் பார்ப்பது உங்களை எங்கு அழைத்துச் செல்லும்?",
      "options": ["space", "time || காலம்", "mars", "cars"],
      "answer": 1,
      "explanation": "Reading history helps us look back in time. || வரலாறு வாசிப்பது நம்மை கடந்த காலத்திற்கு அழைத்துச் செல்லும்."
    },
    {
      "question": "The poem 'Treasure Trove' mentions visiting a lovely _______. || 'புதையல் பெட்டி' கவிதையில் எதைப் பார்ப்பதாகக் கூறப்படுகிறது?",
      "options": ["earthworm", "mermaid || கடல் கன்னி", "fish", "ocean"],
      "answer": 1,
      "explanation": "The poem describes visiting a mermaid under the sea. || கடலுக்கு அடியில் கடல் கன்னியைப் பார்ப்பதாகக் கூறப்பட்டுள்ளது."
    },
    {
      "question": "In the poem, discovering a mystery helps you solve a _______. || கவிதையில், மர்மத்தைக் கண்டறிவது எதைத் தீர்க்க உதவுகிறது?",
      "options": ["puzzle", "crime || குற்றம்", "time", "game"],
      "answer": 1,
      "explanation": "Reading helps in discovering mysteries and solving crimes. || வாசிப்பு மர்மங்களைக் கண்டறியவும் குற்றங்களைத் தீர்க்கவும் உதவுகிறது."
    },
    {
      "question": "Reading about space feels like landing on _______. || விண்வெளி பற்றிப் படிப்பது எங்கே இறங்குவது போல இருக்கும்?",
      "options": ["the moon", "mars || செவ்வாய் கோள்", "the sun", "stars"],
      "answer": 1,
      "explanation": "The poem says we can land on Mars while reading about space. || விண்வெளி பற்றிப் படிப்பது செவ்வாய் கோளில் இறங்குவது போல இருக்கும்."
    },
    {
      "question": "Match the rhyming word for 'cars'.",
      "options": ["mars || செவ்வாய் கோள்", "crime", "time", "head"],
      "answer": 0,
      "explanation": "'Cars' rhymes with 'mars'."
    },
    {
      "question": "Match the rhyming word for 'head'.",
      "options": ["mars", "cars", "time", "bed || படுக்கை"],
      "answer": 3,
      "explanation": "'Head' rhymes with 'bed'."
    },
    {
      "question": "Match the rhyming word for 'crime'.",
      "options": ["mars", "bed", "time || காலம்", "cars"],
      "answer": 2,
      "explanation": "'Crime' rhymes with 'time'."
    },
    {
      "question": "Fill in the blank: 'I _______ by bus.'",
      "options": ["comes", "coming", "come || வருகிறேன்", "came"],
      "answer": 2,
      "explanation": "For first-person singular 'I' in present tense, we use 'come'. || 'I' என்ற சொல்லிற்கு 'come' என்ற வினைச்சொல் அமையும்."
    },
    {
      "question": "Fill in the blank: 'He _______ by bus.'",
      "options": ["come", "comes || வருகிறான்", "coming", "came"],
      "answer": 1,
      "explanation": "For third-person singular 'He', the verb take an 's'. || 'He' என்ற சொல்லிற்கு 'comes' என்ற வினைச்சொல் வரும்."
    },
    {
      "question": "Fill in the blank: 'She _______ by bus.'",
      "options": ["coming", "come", "came", "comes || வருகிறாள்"],
      "answer": 3,
      "explanation": "For third-person singular 'She', the verb takes an 's'."
    },
    {
      "question": "Fill in the blank: 'They _______ by bus.'",
      "options": ["comes", "come || வருகிறார்கள்", "coming", "came"],
      "answer": 1,
      "explanation": "For plural subjects like 'They', we use 'come'."
    },
    {
      "question": "Fill in the blank: 'We _______ by bus.'",
      "options": ["comes", "coming", "come || வருகிறோம்", "came"],
      "answer": 2,
      "explanation": "The subject 'We' take the base verb 'come'."
    },
    {
      "question": "Fill in: 'The birds _______ in the sky.'",
      "options": ["flies", "fly || பறக்கின்றன", "flying", "flew"],
      "answer": 1,
      "explanation": "The subject is plural (birds), so we use 'fly'. || பன்மைச் சொல்லிற்கு 'fly' என்ற வினைச்சொல் வரும்."
    },
    {
      "question": "Fill in: 'The bird _______ in the sky.'",
      "options": ["fly", "flies || பறக்கிறது", "flying", "flew"],
      "answer": 1,
      "explanation": "The subject is singular (bird), so 'fly' becomes 'flies'."
    },
    {
      "question": "Fill in: 'It _______ very fast.'",
      "options": ["run", "running", "ran", "runs || ஓடுகிறது"],
      "answer": 3,
      "explanation": "Singular 'It' takes 'runs' in present tense. || 'It' என்ற சொல்லிற்கு 'runs' வரும்."
    },
    {
      "question": "Fill in: 'The dog _______ very fast.'",
      "options": ["run", "runs || ஓடுகிறது", "running", "ran"],
      "answer": 1,
      "explanation": "'The dog' is singular, so we use 'runs'."
    },
    {
      "question": "Fill in: 'Dogs _______ very fast.'",
      "options": ["runs", "running", "run || ஓடுகின்றன", "ran"],
      "answer": 2,
      "explanation": "'Dogs' is plural, so we use 'run'."
    },
    {
      "question": "Fill in: 'Raju _______ good food.'",
      "options": ["cook", "cooks || சமைக்கிறான்", "cooking", "cooked"],
      "answer": 1,
      "explanation": "Raju (singular) takes 'cooks'."
    },
    {
      "question": "Fill in: 'I _______ to do my own work.'",
      "options": ["loves", "loving", "loved", "love || விரும்புகிறேன்"],
      "answer": 3,
      "explanation": "'I' takes the base verb 'love'."
    },
    {
      "question": "Fill in: 'Vinoth _______ his own clothes.'",
      "options": ["wash", "washing", "washes || துவைக்கிறான்", "washed"],
      "answer": 2,
      "explanation": "Vinoth (singular) takes 'washes'."
    },
    {
      "question": "Fill in: 'Aliya _______ the border of cloth.'",
      "options": ["hem", "hems || ஓரம் தைக்கிறாள்", "hemming", "hemmed"],
      "answer": 1,
      "explanation": "Aliya (singular) takes 'hems'."
    },
    {
      "question": "Fill in: 'Megalai _______ with the elders.'",
      "options": ["swims || நீந்துகிறாள்", "swim", "swimming", "swam"],
      "answer": 0,
      "explanation": "Megalai (singular) takes 'swims'."
    },
    {
      "question": "Fill in: 'Rosy _______ her bicycle every day.'",
      "options": ["ride", "riding", "rode", "rides || ஓட்டுகிறாள்"],
      "answer": 3,
      "explanation": "Rosy (singular) takes 'rides'."
    },
    {
      "question": "Fill in: 'My parents _______ everything for me.'",
      "options": ["does", "doing", "did", "do || செய்கிறார்கள்"],
      "answer": 3,
      "explanation": "'Parents' is plural, so we use 'do'."
    },
    {
      "question": "Fill in: 'An earthworm _______ in the ground.'",
      "options": ["live", "living", "lives || வாழ்கிறது", "lived"],
      "answer": 2,
      "explanation": "'Earthworm' (singular) takes 'lives'."
    },
    {
      "question": "Fill in: 'A mermaid _______ a tail of a fish.'",
      "options": ["have", "having", "has || பெற்றுள்ளது", "had"],
      "answer": 2,
      "explanation": "Singular subject uses 'has'."
    },
    {
      "question": "Fill in: 'You _______ a great job.'",
      "options": ["does", "doing", "do || செய்கிறாய்", "did"],
      "answer": 2,
      "explanation": "'You' takes the base verb 'do'."
    }
]

file_path = r'c:\Users\MATHAN\2026-SPECIAL-EXAM\PAPER 1\json-db\lessons\english\4\eng_4_t1_l2.json'

with open(file_path, 'r', encoding='utf-8') as f:
    lesson_data = json.load(f)

# Replace the existing sample questions with these 60 new ones
lesson_data['quiz']['questions'] = new_quiz_questions

with open(file_path, 'w', encoding='utf-8') as f:
    json.dump(lesson_data, f, ensure_ascii=False, indent=2)

print("Successfully updated Grade 4 English Lesson 2 with 60 bilingual questions.")
