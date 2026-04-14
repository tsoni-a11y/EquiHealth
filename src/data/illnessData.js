export const illnessData = {
  hypertension: {
    labels: {
      en: 'Hypertension',
      hi: 'उच्च रक्तचाप'
    },
    medications: {
      en: ['Amlodipine', 'Losartan', 'Hydrochlorothiazide'],
      hi: ['एम्लोडिपिन', 'लोसार्टन', 'हाइड्रोक्लोरोथियाज़ाइड']
    },
    diet: {
      en: ['Leafy greens', 'Berries', 'Nuts and seeds', 'Reduce excess salt'],
      hi: ['हरी पत्तेदार सब्जियां', 'बेरीज़', 'मेवे और बीज', 'अधिक नमक कम करें']
    },
    dietPlan: {
      en: {
        subtitle: 'For blood pressure support',
        tags: ['Low Sodium', 'Heart Healthy', 'Vegetarian'],
        meals: {
          breakfast: {
            title: 'Breakfast',
            description: 'Oats upma and cucumber raita',
            meta: '320 kcal - Low GI'
          },
          lunch: {
            title: 'Lunch',
            description: 'Brown rice, dal, bhindi',
            meta: '450 kcal - Heart healthy'
          },
          dinner: {
            title: 'Dinner',
            description: '2 rotis, lauki sabzi, salad',
            meta: '380 kcal - Low sodium'
          }
        }
      },
      hi: {
        subtitle: 'रक्तचाप नियंत्रण के लिए',
        tags: ['कम नमक', 'हृदय अनुकूल', 'शाकाहारी'],
        meals: {
          breakfast: {
            title: 'नाश्ता',
            description: 'ओट्स उपमा और खीरा रायता',
            meta: '320 kcal - लो GI'
          },
          lunch: {
            title: 'दोपहर का भोजन',
            description: 'ब्राउन राइस, दाल, भिंडी',
            meta: '450 kcal - हृदय अनुकूल'
          },
          dinner: {
            title: 'रात का भोजन',
            description: '2 रोटी, लौकी सब्ज़ी, सलाद',
            meta: '380 kcal - कम नमक'
          }
        }
      }
    },
    info: {
      en: {
        overview: [
          'High blood pressure, or hypertension, is a common condition that affects the body\'s arteries.',
          'In hypertension, the force of blood pushing against artery walls is too high, so the heart works harder to circulate blood.',
          'Blood pressure has two components: systolic (top number) and diastolic (bottom number).',
          'Normal blood pressure is lower than 120/80 mm Hg.',
          'In the U.S., high blood pressure is defined as systolic 130 mm Hg or higher, or diastolic 80 mm Hg or higher.'
        ],
        categories: [
          'Normal: lower than 120/80 mm Hg',
          'Elevated: systolic 120-129 mm Hg and diastolic below 80 mm Hg',
          'Stage 1 hypertension: systolic 130-139 mm Hg or diastolic 80-89 mm Hg',
          'Stage 2 hypertension: systolic 140 mm Hg or higher, or diastolic 90 mm Hg or higher'
        ],
        types: [
          'Primary hypertension: can be linked to genetics or family history',
          'Secondary hypertension: can be caused by underlying medication or medical condition'
        ],
        lifestyle: [
          'Quit smoking',
          'Eat a healthy diet'
        ],
        sources: [
          'https://my.clevelandclinic.org/health/diseases/4314-hypertension-high-blood-pressure',
          'https://www.mayoclinic.org/diseases-conditions/high-blood-pressure/symptoms-causes/syc-20373410',
          'https://www.who.int/news-room/fact-sheets/detail/hypertension'
        ]
      },
      hi: {
        overview: [
          'उच्च रक्तचाप एक सामान्य स्थिति है जो शरीर की धमनियों को प्रभावित करती है।',
          'उच्च रक्तचाप में धमनियों की दीवारों पर दबाव अधिक होता है, इसलिए हृदय को रक्त पंप करने के लिए अधिक मेहनत करनी पड़ती है।',
          'रक्तचाप के दो भाग होते हैं: सिस्टोलिक (ऊपरी संख्या) और डायस्टोलिक (निचली संख्या)।',
          'सामान्य रक्तचाप 120/80 mm Hg से कम होता है।',
          'अमेरिका में उच्च रक्तचाप को सिस्टोलिक 130 mm Hg या अधिक, या डायस्टोलिक 80 mm Hg या अधिक माना जाता है।'
        ],
        categories: [
          'सामान्य: 120/80 mm Hg से कम',
          'एलेवेटेड: सिस्टोलिक 120-129 mm Hg और डायस्टोलिक 80 mm Hg से कम',
          'स्टेज 1: सिस्टोलिक 130-139 mm Hg या डायस्टोलिक 80-89 mm Hg',
          'स्टेज 2: सिस्टोलिक 140 mm Hg या अधिक, या डायस्टोलिक 90 mm Hg या अधिक'
        ],
        types: [
          'प्राथमिक उच्च रक्तचाप: आनुवंशिक या पारिवारिक इतिहास से जुड़ा हो सकता है',
          'द्वितीयक उच्च रक्तचाप: दवाइयों या किसी अन्य बीमारी के कारण हो सकता है'
        ],
        lifestyle: [
          'धूम्रपान छोड़ें',
          'स्वस्थ आहार लें'
        ],
        sources: [
          'https://my.clevelandclinic.org/health/diseases/4314-hypertension-high-blood-pressure',
          'https://www.mayoclinic.org/diseases-conditions/high-blood-pressure/symptoms-causes/syc-20373410',
          'https://www.who.int/news-room/fact-sheets/detail/hypertension'
        ]
      }
    },
    infoCard: {
      en: {
        whatIsTitle: 'What is Hypertension?',
        whatIsLines: [
          'Blood pressure stays high over time.',
          'It can affect heart, kidneys, and blood vessels.',
          'Healthy diet and medication help control it.'
        ],
        medicationTitle: 'Losartan (Brief)',
        medicationLines: [
          'Use: helps lower blood pressure.',
          'Common effects: dizziness, tiredness.',
          'Use exactly as prescribed by clinician.'
        ],
        warningTitle: 'Contraindication Alert',
        warningLines: ['Some medications may interact.', 'Always confirm combinations with your provider.']
      },
      hi: {
        whatIsTitle: 'उच्च रक्तचाप क्या है?',
        whatIsLines: [
          'समय के साथ रक्तचाप लगातार उच्च रहता है।',
          'यह हृदय, किडनी और रक्त वाहिकाओं को प्रभावित कर सकता है।',
          'स्वस्थ आहार और दवाइयों से नियंत्रण में मदद मिलती है।'
        ],
        medicationTitle: 'लोसार्टन (संक्षेप)',
        medicationLines: [
          'उपयोग: रक्तचाप कम करने में मदद।',
          'सामान्य प्रभाव: चक्कर, थकान।',
          'डॉक्टर की सलाह अनुसार ही लें।'
        ],
        warningTitle: 'सावधानी अलर्ट',
        warningLines: ['कुछ दवाइयों के साथ प्रतिक्रिया हो सकती है।', 'दवाइयों का संयोजन डॉक्टर से जरूर पूछें।']
      }
    }
  },
  diabetes: {
    labels: {
      en: 'Diabetes',
      hi: 'मधुमेह'
    },
    medications: {
      en: ['Metformin', 'Glimepiride'],
      hi: ['मेटफॉर्मिन', 'ग्लिमेपिराइड']
    },
    diet: {
      en: ['High-fiber foods', 'Whole grains', 'Limit sugary drinks'],
      hi: ['उच्च फाइबर भोजन', 'साबुत अनाज', 'मीठे पेय कम करें']
    },
    dietPlan: {
      en: {
        subtitle: 'For sugar control',
        tags: ['Low Sugar', 'High Fiber', 'Balanced Plate'],
        meals: {
          breakfast: { title: 'Breakfast', description: 'Besan chilla with salad', meta: '300 kcal - Low sugar' },
          lunch: { title: 'Lunch', description: 'Millet roti, dal, mixed vegetables', meta: '430 kcal - Balanced carbs' },
          dinner: { title: 'Dinner', description: 'Paneer bhurji, sauteed vegetables', meta: '360 kcal - High protein' }
        }
      },
      hi: {
        subtitle: 'शुगर नियंत्रण के लिए',
        tags: ['कम शुगर', 'उच्च फाइबर', 'संतुलित थाली'],
        meals: {
          breakfast: { title: 'नाश्ता', description: 'बेसन चीला और सलाद', meta: '300 kcal - कम शुगर' },
          lunch: { title: 'दोपहर का भोजन', description: 'मिलेट रोटी, दाल, मिक्स सब्ज़ी', meta: '430 kcal - संतुलित कार्ब्स' },
          dinner: { title: 'रात का भोजन', description: 'पनीर भुर्जी, सॉते सब्ज़ियां', meta: '360 kcal - उच्च प्रोटीन' }
        }
      }
    },
    info: {
      en: {
        overview: ['Detailed diabetes info will be added by your next dataset.'],
        categories: ['Dataset pending'],
        types: ['Dataset pending'],
        lifestyle: ['Eat balanced meals', 'Follow clinician guidance'],
        sources: []
      },
      hi: {
        overview: ['अगले डेटा सेट के साथ विस्तृत मधुमेह जानकारी जोड़ी जाएगी।'],
        categories: ['डेटासेट लंबित'],
        types: ['डेटासेट लंबित'],
        lifestyle: ['संतुलित आहार लें', 'डॉक्टर की सलाह का पालन करें'],
        sources: []
      }
    },
    infoCard: {
      en: {
        whatIsTitle: 'What is Diabetes?',
        whatIsLines: ['Blood sugar stays high over time.', 'Healthy meals and medicine help control it.'],
        medicationTitle: 'Metformin (Brief)',
        medicationLines: ['Use: lowers blood sugar in Type 2 diabetes.', 'Common effects: nausea, stomach upset.'],
        warningTitle: 'Contraindication Alert',
        warningLines: ['Confirm kidney status with your clinician before use.']
      },
      hi: {
        whatIsTitle: 'मधुमेह क्या है?',
        whatIsLines: ['रक्त शर्करा समय के साथ ऊंची रहती है।', 'संतुलित भोजन और दवा से नियंत्रण में मदद मिलती है।'],
        medicationTitle: 'मेटफॉर्मिन (संक्षेप)',
        medicationLines: ['उपयोग: टाइप 2 मधुमेह में शुगर कम करने में मदद।', 'सामान्य प्रभाव: मतली, पेट खराब।'],
        warningTitle: 'सावधानी अलर्ट',
        warningLines: ['उपयोग से पहले किडनी स्थिति डॉक्टर से जांचें।']
      }
    }
  },
  asthma: {
    labels: {
      en: 'Asthma',
      hi: 'दमा'
    },
    medications: {
      en: ['Salbutamol inhaler', 'Budesonide inhaler'],
      hi: ['साल्बुटामोल इनहेलर', 'बुडेसोनाइड इनहेलर']
    },
    diet: {
      en: ['Hydration and anti-inflammatory foods', 'Avoid trigger foods if identified'],
      hi: ['पर्याप्त पानी और सूजन-रोधी भोजन', 'यदि ट्रिगर भोजन पता हो तो उनसे बचें']
    },
    dietPlan: {
      en: {
        subtitle: 'For breathing support',
        tags: ['Hydration', 'Anti-inflammatory', 'Balanced'],
        meals: {
          breakfast: { title: 'Breakfast', description: 'Warm porridge and fruit', meta: 'Easy to digest' },
          lunch: { title: 'Lunch', description: 'Dal, rice, cooked vegetables', meta: 'Balanced nutrients' },
          dinner: { title: 'Dinner', description: 'Soup, roti, light sabzi', meta: 'Light evening meal' }
        }
      },
      hi: {
        subtitle: 'सांस समर्थन के लिए',
        tags: ['हाइड्रेशन', 'सूजन-रोधी', 'संतुलित'],
        meals: {
          breakfast: { title: 'नाश्ता', description: 'गरम दलिया और फल', meta: 'आसान पाचन' },
          lunch: { title: 'दोपहर का भोजन', description: 'दाल, चावल, पकी सब्जियां', meta: 'संतुलित पोषण' },
          dinner: { title: 'रात का भोजन', description: 'सूप, रोटी, हल्की सब्ज़ी', meta: 'हल्का शाम भोजन' }
        }
      }
    },
    info: {
      en: {
        overview: ['Detailed asthma info will be added by your next dataset.'],
        categories: ['Dataset pending'],
        types: ['Dataset pending'],
        lifestyle: ['Avoid known triggers', 'Use inhalers as prescribed'],
        sources: []
      },
      hi: {
        overview: ['अगले डेटा सेट के साथ दमा की विस्तृत जानकारी जोड़ी जाएगी।'],
        categories: ['डेटासेट लंबित'],
        types: ['डेटासेट लंबित'],
        lifestyle: ['ज्ञात ट्रिगर से बचें', 'निर्धारित इनहेलर का उपयोग करें'],
        sources: []
      }
    },
    infoCard: {
      en: {
        whatIsTitle: 'What is Asthma?',
        whatIsLines: ['Asthma causes airway inflammation and breathing difficulty.'],
        medicationTitle: 'Salbutamol Inhaler (Brief)',
        medicationLines: ['Use: relieves sudden breathing symptoms quickly.'],
        warningTitle: 'Contraindication Alert',
        warningLines: ['If frequent use is needed, consult clinician for long-term control.']
      },
      hi: {
        whatIsTitle: 'दमा क्या है?',
        whatIsLines: ['दमा में वायुमार्ग में सूजन और सांस लेने में कठिनाई होती है।'],
        medicationTitle: 'साल्बुटामोल इनहेलर (संक्षेप)',
        medicationLines: ['उपयोग: अचानक सांस की तकलीफ में त्वरित राहत।'],
        warningTitle: 'सावधानी अलर्ट',
        warningLines: ['बार-बार जरूरत हो तो दीर्घकालिक नियंत्रण के लिए डॉक्टर से मिलें।']
      }
    }
  }
};

export const illnessOptions = ['hypertension', 'diabetes', 'asthma'];
