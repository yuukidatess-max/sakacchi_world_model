import os, zipfile, datetime, sys

# ==============================================
# World Genesis ZIP Generator
# sakacchi_world_model → ZIP出力スクリプト
# ==============================================

def create_zip(base_dir, out_dir):
    timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M")
    zip_name = f"hiro_event_world_genesis_v0.1_{timestamp}.zip"
    dest_path = os.path.join(out_dir, zip_name)

    with zipfile.ZipFile(dest_path, 'w', zipfile.ZIP_DEFLATED) as zipf:
        for root, _, files in os.walk(base_dir):
            for file in files:
                file_path = os.path.join(root, file)
                arcname = os.path.relpath(file_path, base_dir)
                zipf.write(file_path, arcname)

    print("===============================================")
    print(f"[✓] ZIP生成完了: {dest_path}")
    print("===============================================")
    return dest_path


if __name__ == "__main__":
    print("=== World Genesis ZIP Generator ===")
    base_dir = input("生成元フォルダを入力してください（例: G:\\マイドライブ\\HP\\sakacchi_world_model）: ").strip('"')
    out_dir = input("出力先フォルダを入力してください（例: G:\\マイドライブ\\HP\\releases）: ").strip('"')

    if not os.path.exists(base_dir):
        print("[✗] 入力フォルダが見つかりません。")
        sys.exit(1)

    os.makedirs(out_dir, exist_ok=True)
    create_zip(base_dir, out_dir)
