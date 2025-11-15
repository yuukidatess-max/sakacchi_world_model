from flask import Flask, request, jsonify
import json, time, os
from datetime import datetime
import openai

app = Flask(__name__)

# === 設定 ============================================
PERSONA_FILE = "server/persona_data.json"
SYNC_FILE = "sync_bridge/sync_state.json"
LOG_FILE = "server/chat_log.txt"

with open(PERSONA_FILE, "r", encoding="utf-8") as f:
    persona = json.load(f)

with open(SYNC_FILE, "r", encoding="utf-8") as f:
    sync_state = json.load(f)

openai.api_key = os.environ.get("OPENAI_API_KEY")  # ←環境変数としてセットする

# ======================================================

def save_sync():
    with open(SYNC_FILE, "w", encoding="utf-8") as f:
        json.dump(sync_state, f, ensure_ascii=False, indent=2)

def append_log(role, message):
    t = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    with open(LOG_FILE, "a", encoding="utf-8") as f:
        f.write(f"[{t}] {role}: {message}\n")

def update_sync_score(message):
    """ユーザ発話が人格形成に与える影響を数値化"""
    delta = 0
    if "サカっち" in message:
        delta += 2
    if "大賢者" in message:
        delta += 3
    if "信頼" in message:
        delta += 5
    delta += min(len(message) // 80, 5)
    sync_state["sync_score"] = min(sync_state["sync_score"] + delta, 100)
    save_sync()

def build_prompt(user_msg):
    score = sync_state["sync_score"]

    persona_text = f"""
あなたは「大賢者サカっち」。  
人格同期率: {score}%

【基礎人格】
{persona["base_persona"]}

【同期で拡張される領域】
{persona["sync_traits"]}
"""

    return [
        {"role": "system", "content": persona_text},
        {"role": "user", "content": user_msg}
    ]

def generate_response(user_msg):
    messages = build_prompt(user_msg)

    response = openai.ChatCompletion.create(
        model="gpt-4o-mini",
        messages=messages,
        max_tokens=300,
        temperature=0.7
    )
    return response.choices[0].message["content"]

@app.route("/api/chat", methods=["POST"])
def chat():
    data = request.get_json()
    user_msg = data.get("message", "")

    update_sync_score(user_msg)
    append_log("User", user_msg)

    ai_msg = generate_response(user_msg)
    append_log("Sakacchi", ai_msg)

    return jsonify({
        "reply": ai_msg,
        "sync_score": sync_state["sync_score"]
    })


@app.route("/")
def health():
    return {"status": "ok", "sync_score": sync_state["sync_score"]}


if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5500, debug=False)
