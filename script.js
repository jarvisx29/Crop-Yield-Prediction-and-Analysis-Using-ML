// ============================================================
// CONFIGURATION
// ============================================================
const IS_LOCAL    = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
const BACKEND     = IS_LOCAL ? 'http://localhost:5001' : 'https://crop-yield-prediction-and-analysis-using.onrender.com';
const API_URL     = BACKEND + '/predict';
const COMPARE_URL = BACKEND + '/compare';

// ============================================================
// TRANSLATIONS
// ============================================================
const translations = {
  en: {
    lang_label:         'Language:',
    title:              'Crop Yield Prediction System',
    subtitle:           'Simple tool to estimate crop yield based on farm conditions',
    form_heading:       'Enter Farm Details',
    label_country:      'Country',
    label_crop:         'Crop Type',
    label_rainfall:     'Rainfall (mm per year)',
    label_temp:         'Average Temperature (°C)',
    label_pesticide:    'Pesticide Usage (tonnes)',
    label_data_year:    'Data Year',
    hint_data_year:     'Year your farm data is from',
    label_predict_year: 'Predict for Year',
    hint_predict_year:  'Future year to forecast (optional)',
    btn_predict:        'Predict Yield',
    result_heading:     'Prediction Result',
    result_label:       'Predicted Yield:',
    result_label_year:  'Predicted Yield for', // "Predicted Yield for 2029:"
    unit:               'tons / hectare',
    btn_reset:          'Try Again',
    footer:             'This tool provides estimates. Always consult a local agricultural expert.',
    error_fields:       'Please fill in all required fields (including Country).',
    error_server:       'Unable to reach the server. Please try again later.',
    error_predict_year: 'Predict year must be different from the data year.',
    cat_good:           'Good Yield',
    cat_avg:            'Average Yield',
    cat_low:            'Low Yield',
    rec_good:           'Current conditions are suitable for good production. Maintain your current practices.',
    rec_avg:            'Yield is moderate. Consider improving irrigation or soil nutrients for better results.',
    rec_low:            'Yield may be low. Consult an agricultural expert to improve farming conditions.',
    // Trend banner
    trend_increase:     'INCREASE VS',
    trend_decrease:     'DECREASE VS',
    trend_same:         'NO CHANGE VS',
    trend_higher:       'Higher yield in',
    trend_lower:        'Lower yield in',
    trend_equal:        'Same yield as',
    trend_than:         'than',
    trend_tha:          't/ha',
    trend_baseline:     'baseline',
  },
  ta: {
    lang_label:         'மொழி:',
    title:              'பயிர் விளைச்சல் கணிப்பு அமைப்பு',
    subtitle:           'விவசாய நிலைகளின் அடிப்படையில் பயிர் விளைச்சலை மதிப்பிடும் எளிய கருவி',
    form_heading:       'பண்ணை விவரங்களை உள்ளிடவும்',
    label_country:      'நாடு',
    label_crop:         'பயிர் வகை',
    label_rainfall:     'மழையளவு (மி.மீ / ஆண்டு)',
    label_temp:         'சராசரி வெப்பநிலை (°C)',
    label_pesticide:    'பூச்சிக்கொல்லி பயன்பாடு (டன்)',
    label_data_year:    'தரவு ஆண்டு',
    hint_data_year:     'உங்கள் தரவு எந்த ஆண்டு சேகரிக்கப்பட்டது',
    label_predict_year: 'கணிக்க வேண்டிய ஆண்டு',
    hint_predict_year:  'எதிர்கால ஆண்டு (விருப்பத்தேர்வு)',
    btn_predict:        'விளைச்சலை கணிக்கவும்',
    result_heading:     'கணிப்பு முடிவு',
    result_label:       'கணிக்கப்பட்ட விளைச்சல்:',
    result_label_year:  'கணிக்கப்பட்ட விளைச்சல்',
    unit:               'டன் / ஹெக்டேர்',
    btn_reset:          'மீண்டும் முயற்சிக்கவும்',
    footer:             'இந்த கருவி மதிப்பீடுகளை வழங்குகிறது. எப்போதும் உள்ளூர் விவசாய நிபுணரை அணுகவும்.',
    error_fields:       'அனைத்து தேவையான புலங்களையும் நிரப்பவும் (நாடு உட்பட).',
    error_server:       'சேவையகத்தை அடைய முடியவில்லை. பின்னர் மீண்டும் முயற்சிக்கவும்.',
    error_predict_year: 'கணிப்பு ஆண்டு தரவு ஆண்டிலிருந்து வேறுபட்டதாக இருக்க வேண்டும்.',
    cat_good:           'நல்ல விளைச்சல்',
    cat_avg:            'சராசரி விளைச்சல்',
    cat_low:            'குறைந்த விளைச்சல்',
    rec_good:           'தற்போதைய நிலைகள் நல்ல உற்பத்திக்கு ஏற்றவை. உங்கள் தற்போதைய நடைமுறைகளை பராமரிக்கவும்.',
    rec_avg:            'விளைச்சல் மிதமானது. சிறந்த முடிவுகளுக்கு நீர்ப்பாசனம் அல்லது மண் ஊட்டச்சத்துக்களை மேம்படுத்துவதை கருத்தில் கொள்ளுங்கள்.',
    rec_low:            'விளைச்சல் குறைவாக இருக்கலாம். விவசாய நிலைகளை மேம்படுத்த விவசாய நிபுணரை அணுகவும்.',
    trend_increase:     'அதிகரிப்பு',
    trend_decrease:     'குறைவு',
    trend_same:         'மாற்றமில்லை',
    trend_higher:       'அதிக விளைச்சல்',
    trend_lower:        'குறைந்த விளைச்சல்',
    trend_equal:        'சம விளைச்சல்',
    trend_than:         'விட',
    trend_tha:          'டன்/ஹெக்.',
    trend_baseline:     'அடிப்படை',
  },
  hi: {
    lang_label:         'भाषा:',
    title:              'फसल उपज भविष्यवाणी प्रणाली',
    subtitle:           'खेत की परिस्थितियों के आधार पर फसल उपज का अनुमान लगाने का सरल उपकरण',
    form_heading:       'खेत की जानकारी दर्ज करें',
    label_country:      'देश',
    label_crop:         'फसल का प्रकार',
    label_rainfall:     'वर्षा (मिमी प्रति वर्ष)',
    label_temp:         'औसत तापमान (°C)',
    label_pesticide:    'कीटनाशक उपयोग (टन)',
    label_data_year:    'डेटा वर्ष',
    hint_data_year:     'आपका खेत डेटा किस वर्ष का है',
    label_predict_year: 'भविष्यवाणी वर्ष',
    hint_predict_year:  'भविष्य का वर्ष (वैकल्पिक)',
    btn_predict:        'उपज की भविष्यवाणी करें',
    result_heading:     'भविष्यवाणी परिणाम',
    result_label:       'अनुमानित उपज:',
    result_label_year:  'अनुमानित उपज',
    unit:               'टन / हेक्टेयर',
    btn_reset:          'फिर से कोशिश करें',
    footer:             'यह उपकरण अनुमान प्रदान करता है। हमेशा स्थानीय कृषि विशेषज्ञ से परामर्श लें।',
    error_fields:       'कृपया सभी आवश्यक फ़ील्ड भरें (देश सहित)।',
    error_server:       'सर्वर से कनेक्ट नहीं हो सका। कृपया बाद में पुनः प्रयास करें।',
    error_predict_year: 'भविष्यवाणी वर्ष डेटा वर्ष से अलग होना चाहिए।',
    cat_good:           'अच्छी उपज',
    cat_avg:            'औसत उपज',
    cat_low:            'कम उपज',
    rec_good:           'वर्तमान परिस्थितियाँ अच्छे उत्पादन के लिए उपयुक्त हैं। अपनी वर्तमान प्रथाओं को बनाए रखें।',
    rec_avg:            'उपज मध्यम है। बेहतर परिणामों के लिए सिंचाई या मिट्टी के पोषक तत्वों को बेहतर बनाने पर विचार करें।',
    rec_low:            'उपज कम हो सकती है। खेती की परिस्थितियों में सुधार के लिए कृषि विशेषज्ञ से परामर्श करें।',
    trend_increase:     'वृद्धि',
    trend_decrease:     'कमी',
    trend_same:         'कोई बदलाव नहीं',
    trend_higher:       'अधिक उपज',
    trend_lower:        'कम उपज',
    trend_equal:        'समान उपज',
    trend_than:         'की तुलना में',
    trend_tha:          'टन/हे.',
    trend_baseline:     'आधार',
  }
};

// ============================================================
// STATE
// ============================================================
let currentLang    = 'en';
let lastTrendData  = null;   // stored so language switch can re-render banner

// ============================================================
// LANGUAGE SWITCHING
// ============================================================
function setLang(lang) {
  currentLang = lang;

  document.querySelectorAll('.lang-btn').forEach(btn => btn.classList.remove('active'));
  event.target.classList.add('active');

  const t = translations[lang];

  // Update all data-key elements
  document.querySelectorAll('[data-key]').forEach(el => {
    const key = el.getAttribute('data-key');
    if (t[key] !== undefined) el.textContent = t[key];
  });

  // Placeholders
  document.getElementById('rainfall').placeholder     = lang === 'en' ? 'e.g. 1200' : (lang === 'ta' ? 'எ.கா. 1200' : 'उदा. 1200');
  document.getElementById('temperature').placeholder  = lang === 'en' ? 'e.g. 25'   : (lang === 'ta' ? 'எ.கா. 25'   : 'उदा. 25');
  document.getElementById('pesticide').placeholder    = lang === 'en' ? 'e.g. 50'   : (lang === 'ta' ? 'எ.கா. 50'   : 'उदा. 50');
  document.getElementById('year').placeholder         = lang === 'en' ? 'e.g. 2024' : (lang === 'ta' ? 'எ.கா. 2024' : 'उदा. 2024');
  document.getElementById('predict-year').placeholder = lang === 'en' ? 'e.g. 2029' : (lang === 'ta' ? 'எ.கா. 2029' : 'उदा. 2029');

  // Re-render result if visible
  const resultSection = document.getElementById('result-section');
  if (resultSection.style.display !== 'none') {
    const yieldVal = parseFloat(document.getElementById('yield-value').textContent);
    if (!isNaN(yieldVal)) renderCategory(yieldVal);

    // Re-render trend banner in new language
    if (lastTrendData) showTrend(lastTrendData);
  }
}

// ============================================================
// PREDICTION
// ============================================================
async function predict() {
  const t = translations[currentLang];
  hideError();

  const country     = document.getElementById('country').value.trim();
  const crop        = document.getElementById('crop').value.trim();
  const rainfall    = document.getElementById('rainfall').value.trim();
  const temperature = document.getElementById('temperature').value.trim();
  const pesticide   = document.getElementById('pesticide').value.trim();
  const dataYear    = document.getElementById('year').value.trim();
  const predictYear = document.getElementById('predict-year').value.trim();

  if (!country || !crop || !rainfall || !temperature || !pesticide) {
    showError(t.error_fields);
    return;
  }

  if (predictYear && dataYear && parseInt(predictYear) === parseInt(dataYear)) {
    showError(t.error_predict_year);
    return;
  }

  const btn = document.querySelector('.predict-btn');
  btn.disabled = true;
  btn.classList.add('loading');

  const basePayload = {
    country:     country,
    crop:        crop,
    rainfall:    parseFloat(rainfall),
    temperature: parseFloat(temperature),
    pesticide:   parseFloat(pesticide),
  };

  try {
    if (predictYear) {
      // ── Future year comparison mode ──────────────────────────────
      // current_year = the future year (main predicted result to show)
      // compare_year = data year (baseline)
      const cmpPayload = {
        ...basePayload,
        current_year: parseInt(predictYear),
        compare_type: 'single',
        compare_year: dataYear ? parseInt(dataYear) : 2016,
      };

      const resp = await fetch(COMPARE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cmpPayload),
      });
      if (!resp.ok) throw new Error('Server error');
      const data = await resp.json();
      if (data.error) throw new Error(data.error);

      // Main yield display = future year prediction
      showResult(data.current.predicted_yield, data.current.category, parseInt(predictYear));
      lastTrendData = data;
      showTrend(data);

    } else {
      // ── Simple prediction mode (no future year) ───────────────────
      hideTrend();
      lastTrendData = null;
      const payload = { ...basePayload, year: dataYear ? parseInt(dataYear) : null };

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error('Server error');
      const data = await response.json();
      if (data.error) throw new Error(data.error);

      showResult(parseFloat(data.predicted_yield), data.category, null);
    }

  } catch (err) {
    console.warn('Backend not connected — using mock prediction.', err.message);
    hideTrend();
    lastTrendData = null;
    showResult(mockPredict(basePayload), null, null);
  } finally {
    btn.disabled = false;
    btn.classList.remove('loading');
  }
}

// ============================================================
// MOCK PREDICTION (fallback when backend is offline)
// ============================================================
function mockPredict({ crop, rainfall, temperature, pesticide }) {
  const baseYields = {
    'Wheat': 3.2, 'Maize': 5.1, 'Barley': 2.8, 'Potatoes': 19.0,
    'Sweet potatoes': 11.0, 'Rye': 2.5, 'Oats': 2.6, 'Garlic': 9.0,
    'Ginger': 8.5, 'Carrots and turnips': 20.0,
    'Cauliflowers and broccoli': 15.0, 'Onions, shallots, green': 17.0,
    'Buckwheat': 1.8, 'Hops': 1.5,
  };
  let base = baseYields[crop] || 3.0;
  if (rainfall > 1000 && rainfall < 2000) base *= 1.1;
  else if (rainfall < 400) base *= 0.75;
  if (temperature >= 18 && temperature <= 30) base *= 1.08;
  else if (temperature < 10 || temperature > 40) base *= 0.7;
  if (pesticide > 0 && pesticide < 200) base *= 1.05;
  return parseFloat((base * (0.92 + Math.random() * 0.16)).toFixed(2));
}

// ============================================================
// RENDER RESULT
// ============================================================
function showResult(yieldTons, serverCategory, forYear) {
  const t = translations[currentLang];

  // Update yield label — if forecasting a future year, say "Predicted Yield for 2029:"
  const labelEl = document.getElementById('result-label-text');
  if (forYear) {
    labelEl.textContent = `${t.result_label_year} ${forYear}:`;
  } else {
    labelEl.textContent = t.result_label;
    labelEl.setAttribute('data-key', 'result_label');
  }

  document.getElementById('yield-value').textContent = yieldTons.toFixed(2);
  renderCategory(yieldTons, serverCategory);

  document.getElementById('result-section').style.display = 'block';
  document.getElementById('result-section').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function renderCategory(yieldTons, serverCategory) {
  const t     = translations[currentLang];
  const badge = document.getElementById('category-badge');
  const rec   = document.getElementById('recommendation-text');

  const cat = serverCategory || (yieldTons >= 5 ? 'good' : yieldTons >= 2 ? 'average' : 'low');

  const map = {
    good:    { text: t.cat_good, rec: t.rec_good },
    average: { text: t.cat_avg,  rec: t.rec_avg  },
    low:     { text: t.cat_low,  rec: t.rec_low  },
  };

  badge.className   = 'category-badge ' + cat;
  badge.textContent = map[cat].text;
  rec.textContent   = map[cat].rec;
}

// ============================================================
// TREND BANNER
// ============================================================
function showTrend(data) {
  const t      = translations[currentLang];
  const banner = document.getElementById('trend-banner');

  const { direction, change_percent, compared, current } = data;
  const baseYear  = compared.label || String(compared.year);
  const futureYear = String(current.year);

  // vs label (top line): e.g.  INCREASE VS 2024  /  அதிகரிப்பு 2024
  // detail (bottom line): e.g. Higher yield in 2029 than 2024 (2.50 t/ha)
  let dirWord, detailText, arrowChar;

  if (direction === 'increase') {
    banner.className = 'trend-up';
    arrowChar   = '▲';
    dirWord     = t.trend_increase;
    detailText  = `${t.trend_higher} ${futureYear} ${t.trend_than} ${baseYear} (${compared.predicted_yield} ${t.trend_tha})`;
  } else if (direction === 'decrease') {
    banner.className = 'trend-down';
    arrowChar   = '▼';
    dirWord     = t.trend_decrease;
    detailText  = `${t.trend_lower} ${futureYear} ${t.trend_than} ${baseYear} (${compared.predicted_yield} ${t.trend_tha})`;
  } else {
    banner.className = 'trend-same';
    arrowChar   = '→';
    dirWord     = t.trend_same;
    detailText  = `${t.trend_equal} ${baseYear} (${compared.predicted_yield} ${t.trend_tha})`;
  }

  document.getElementById('trend-vs-label').textContent     = `${dirWord} ${baseYear}`;
  document.getElementById('trend-arrow').textContent        = arrowChar;
  document.getElementById('trend-percent-value').textContent = `${change_percent}%`;
  document.getElementById('trend-detail').textContent       = detailText;

  banner.style.display = 'block';
}

function hideTrend() {
  const banner = document.getElementById('trend-banner');
  banner.style.display = 'none';
  banner.className = '';
}

// ============================================================
// RESET
// ============================================================
function resetForm() {
  ['country', 'crop', 'rainfall', 'temperature', 'pesticide', 'year', 'predict-year'].forEach(id => {
    document.getElementById(id).value = '';
  });
  document.getElementById('result-section').style.display = 'none';
  lastTrendData = null;
  hideTrend();
  hideError();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ============================================================
// ERROR HELPERS
// ============================================================
function showError(msg) {
  const el = document.getElementById('error-msg');
  el.textContent   = msg;
  el.style.display = 'block';
  el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function hideError() {
  const el = document.getElementById('error-msg');
  el.style.display = 'none';
  el.textContent   = '';
}
