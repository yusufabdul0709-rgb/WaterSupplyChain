export interface FAQItem {
  queryKeywords: string[];
  responseEn: string;
  responseTe: string;
  responseHi: string;
  category: 'supply' | 'complaint' | 'bill' | 'connection' | 'scheme';
}

export const AI_FAQ_DATABASE: FAQItem[] = [
  {
    queryKeywords: ['supply', 'time', 'timing', 'schedule', 'when', 'morning', 'evening', 'water come'],
    category: 'supply',
    responseEn: 'In your sector (MVP Colony, Ward 42), morning water supply runs from 06:00 AM to 08:30 AM, and evening supply runs from 05:30 PM to 07:30 PM. Current line pressure is optimal at 3.4 bar.',
    responseTe: 'మీ సెక్టార్‌ (MVP కాలనీ, వార్డు 42) లో ఉదయం నీటి సరఫరా 06:00 AM నుండి 08:30 AM వరకు, సాయంత్రం 05:30 PM నుండి 07:30 PM వరకు ఉంటుంది. ప్రస్తుత ప్రెజర్ 3.4 బార్ వద్ద సరైన స్థాయిలో ఉంది.',
    responseHi: 'आपके सेक्टर (MVP कॉलोनी, वार्ड 42) में सुबह पानी की आपूर्ति 06:00 AM से 08:30 AM तक और शाम को 05:30 PM से 07:30 PM तक चलती है। वर्तमान दबाव 3.4 बार है।',
  },
  {
    queryKeywords: ['complaint', 'report', 'issue', 'track', 'status', 'leak', 'dirty'],
    category: 'complaint',
    responseEn: 'You can report any water leakage, low pressure, or discolored water directly in the Complaints tab or using the "Report Issue" action. Once submitted, a Complaint ID is generated and automatically assigned to your Sector Engineer within 15 minutes.',
    responseTe: 'మీరు ఏవైనా నీటి లీకేజీలు, తక్కువ ప్రెజర్ లేదా మలిన నీటి సమస్యలను కంప్లైంట్స్ ట్యాబ్ లేదా "రిపోర్ట్ ఇష్యూ" ద్వారా నేరుగా నమోదు చేయవచ్చు. నమోదు చేసిన 15 నిమిషాల్లో సెక్టార్ ఇంజనీర్‌కు అసైన్ చేయబడుతుంది.',
    responseHi: 'आप किसी भी पानी के रिसाव, कम दबाव या गंदे पानी की रिपोर्ट सीधे शिकायत टैब या "रिपोर्ट इश्यू" बटन से कर सकते हैं। सबमिट करने पर शिकायत आईडी 15 मिनट के भीतर इंजीनियर को आवंटित की जाती है।',
  },
  {
    queryKeywords: ['bill', 'payment', 'charge', 'tariff', 'due', 'pay'],
    category: 'bill',
    responseEn: 'GVMC domestic water tariff is ₹120/month for standard 0.5-inch connections under AMRUT 2.0. You can view your bill details in your profile or make online UPI/Card payments through the AP Online portal.',
    responseTe: 'AMRUT 2.0 కింద జివిఎంసి గృహ నీటి వినియోగ ఛార్జీ నెలకు ₹120 (0.5 అంగుళాల కనెక్షన్). మీ బిల్లు వివరాలను ప్రొఫైల్ ద్వారా చూడవచ్చు.',
    responseHi: 'अमृत 2.0 के तहत जीवीएमसी घरेलू जल शुल्क ₹120/माह है। आप अपनी प्रोफ़ाइल में बिल का विवरण देख सकते हैं।',
  },
  {
    queryKeywords: ['new connection', 'apply', 'tap', 'pipeline', 'meter'],
    category: 'connection',
    responseEn: 'To apply for a new GVMC water connection, prepare your Aadhaar Card, Property Tax Assessment receipt, and House Ownership Proof. Submit via "New Connection" in Quick Actions for doorstep verification within 3 working days.',
    responseTe: 'కొత్త జివిఎంసి నీటి కనెక్షన్ కోసం ఆధార్ కార్డు, ఆస్తి పన్ను రసీదు మరియు ఇంటి యజమాని నిరూపణపత్రం అవసరం. "న్యూ కనెక్షన్" ద్వారా దరఖాస్తు చేయండి.',
    responseHi: 'नए जीवीएमसी जल कनेक्शन के लिए आधार कार्ड, संपत्ति कर की रसीद और स्वामित्व प्रमाण पत्र आवश्यक है। Quick Actions में "New Connection" के माध्यम से आवेदन करें।',
  },
  {
    queryKeywords: ['scheme', 'amrut', 'smart city', 'government', 'digital twin'],
    category: 'scheme',
    responseEn: 'GVMC Smart Water Management is built under AMRUT 2.0 & Vizag Smart City Mission. It features IoT flow sensors, automated pressure management, and AI-driven leak detection across 72 municipal wards.',
    responseTe: 'జివిఎంసి స్మార్ట్ వాటర్ మేనేజ్‌మెంట్ అమృత్ 2.0 మరియు వైజాగ్ స్మార్ట్ సిటీ మిషన్ కింద నిర్మించబడింది. ఇది 72 మునిసిపల్ వార్డులలో IoT ఫ్లో సెన్సార్లతో పనిచేస్తుంది.',
    responseHi: 'जीवीएमसी स्मार्ट वाटर मैनेजमेंट अमृत 2.0 और विशाखापट्टनम स्मार्ट सिटी मिशन के तहत विकसित किया गया है।',
  },
];

export const DEFAULT_AI_RESPONSE = {
  en: "I am GVMC Water AI Assistant. I can help you check water supply timings, track complaint status, explain billing tariffs, or guide you through new tap connection procedures. How may I assist you today?",
  te: "నేను జివిఎంసి వాటర్ AI సహాయకుడిని. నీటి సరఫరా వేళలు, ఫిర్యాదుల స్థితి, బిల్లుల వివరాలు లేదా కొత్త కనెక్షన్ల ప్రక్రియలో మీకు సహాయపడగలను.",
  hi: "मैं जीवीएमसी वाटर एआई सहायक हूं। मैं पानी की आपूर्ति के समय, शिकायत की स्थिति, बिलिंग और नए कनेक्शन में आपकी सहायता कर सकता हूं।",
};
