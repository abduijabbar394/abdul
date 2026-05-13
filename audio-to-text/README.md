# অডিও থেকে টেক্সট কনভার্টার (Audio to Text in Bengali)

এটি একটি সম্পূর্ণ ফ্রি এবং অফলাইন-ভিত্তিক অডিও থেকে টেক্সট (Speech to Text) ওয়েব অ্যাপ্লিকেশন। এখানে কোনো পেইড API ব্যবহার করা হয়নি; বরং OpenAI এর `faster-whisper` ওপেন-সোর্স মডেল ব্যবহার করা হয়েছে। 

## ফিচারসমূহ
- **সম্পূর্ণ ফ্রি:** কোনো সাবস্ক্রিপশন বা API Key এর প্রয়োজন নেই।
- **বাংলা UI:** ব্যবহারকারীদের সুবিধার জন্য ইন্টারফেস সম্পূর্ণ বাংলায়।
- **বিভিন্ন ফরম্যাট সাপোর্ট:** mp3, wav, m4a, aac, ogg ফাইল সাপোর্ট করে।
- **কপি ও ডাউনলোড:** রেজাল্ট কপি করার বা ফাইল হিসেবে ডাউনলোড করার সুবিধা আছে।
- **অফলাইন সাপোর্ট:** মডেল একবার ডাউনলোড হয়ে গেলে ইন্টারনেট ছাড়াই রান করা যায়।

---

## 🚀 সেটআপ ও রান করার নিয়ম (Local Setup)

### ১. ব্যাকএন্ড সেটআপ (Python & FastAPI)
প্রথমে আপনার কম্পিউটারে Python 3.8+ ইনস্টল থাকতে হবে।

```bash
# প্রজেক্ট ডিরেক্টরিতে যান
cd audio-to-text/backend

# ভার্চুয়াল এনভায়রনমেন্ট তৈরি করুন (ঐচ্ছিক কিন্তু ভালো)
python -m venv venv
venv\Scripts\activate  # Windows
source venv/bin/activate  # Mac/Linux

# প্রয়োজনীয় লাইব্রেরি ইনস্টল করুন
pip install -r requirements.txt

# সার্ভার রান করুন
uvicorn main:app --reload
```
সার্ভারটি `http://127.0.0.1:8000` পোর্টে রান হবে। 
*নোট: প্রথমবার রান হলে whisper এর 'base' মডেলটি (প্রায় 140MB) ডাউনলোড হবে। তাই একটু সময় লাগতে পারে।*

### ২. ফ্রন্টএন্ড রান করা
ফ্রন্টএন্ডের জন্য কোনো সার্ভার বা সেটআপের প্রয়োজন নেই।
সরাসরি `audio-to-text/frontend/index.html` ফাইলটি আপনার ব্রাউজারে ওপেন করুন। অথবা VS Code-এর **Live Server** এক্সটেনশন ব্যবহার করে রান করতে পারেন।

---

## 🌍 ডিপ্লয়মেন্ট গাইড (Deployment)

### Render বা Railway তে ডিপ্লয় করা
অল্প খরচে বা ফ্রি টিয়ারে ডিপ্লয় করতে চাইলে Render বা Railway ব্যবহার করতে পারেন।
১. এই রিপোজিটরিটি GitHub-এ আপলোড করুন।
২. Render বা Railway তে নতুন Web Service তৈরি করুন।
৩. Build Command: `pip install -r backend/requirements.txt`
৪. Start Command: `uvicorn backend.main:app --host 0.0.0.0 --port $PORT`

### HuggingFace Spaces
HuggingFace এ Docker Space তৈরি করে এই অ্যাপ্লিকেশনটি খুব সহজেই সম্পূর্ণ ফ্রি-তে হোস্ট করতে পারবেন।

---

## 🛠️ টেকনোলজি স্ট্যাক
- **Frontend:** HTML5, CSS3, Vanilla JavaScript (কোনো ফ্রেমওয়ার্ক নেই)। ফন্ট হিসেবে 'Hind Siliguri' এবং আইকনের জন্য FontAwesome ব্যবহার করা হয়েছে।
- **Backend:** Python, FastAPI, Uvicorn।
- **AI Model:** `faster-whisper` (Base model)।
