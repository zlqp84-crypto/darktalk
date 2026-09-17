"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { supabase } from "@/lib/supabase";

const categories = ["대기업·중견기업", "중소기업", "스타트업", "프리랜서", "취업·이직", "급여·연봉", "직장생활", "자유게시판"];

const MAX_IMAGES = 5;
const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

interface ImageDraft {
  file: File;
  previewUrl: string;
}

export default function WritePage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [images, setImages] = useState<ImageDraft[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [checkingAuth, setCheckingAuth] = useState(true);

  const handleFilesSelected = (fileList: FileList | null) => {
    if (!fileList) return;
    const incoming = Array.from(fileList);
    setError("");

    const accepted: ImageDraft[] = [];
    for (const file of incoming) {
      if (images.length + accepted.length >= MAX_IMAGES) {
        setError(`사진은 최대 ${MAX_IMAGES}장까지 첨부할 수 있어요.`);
        break;
      }
      if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
        setError("JPG, PNG, WEBP, GIF 형식의 사진만 첨부할 수 있어요.");
        continue;
      }
      if (file.size > MAX_IMAGE_SIZE) {
        setError(`사진 1장당 최대 5MB까지 첨부할 수 있어요. (${file.name})`);
        continue;
      }
      accepted.push({ file, previewUrl: URL.createObjectURL(file) });
    }

    if (accepted.length > 0) setImages(prev => [...prev, ...accepted]);
  };

  const removeImage = (index: number) => {
    setImages(prev => {
      URL.revokeObjectURL(prev[index].previewUrl);
      return prev.filter((_, i) => i !== index);
    });
  };

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        alert("로그인 후 이용할 수 있어요.");
        router.push("/login");
        return;
      }
      setCheckingAuth(false);
    });
  }, [router]);

  const handleSubmit = async () => {
    setError("");

    if (!category) {
      setError("채널을 선택해주세요.");
      return;
    }
    if (!title.trim()) {
      setError("제목을 입력해주세요.");
      return;
    }
    if (!content.trim()) {
      setError("내용을 입력해주세요.");
      return;
    }

    setSubmitting(true);

    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) {
      alert("로그인 후 이용할 수 있어요.");
      router.push("/login");
      return;
    }

    const imageUrls: string[] = [];
    for (const img of images) {
      const ext = ({ "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp", "image/gif": "gif" } as Record<string, string>)[img.file.type];
      // Ownership is enforced by storage.objects.owner_id, not a public UID path.
      const path = `public/${crypto.randomUUID()}.${ext}`;
      const { error: uploadError } = await supabase.storage.from("post-images").upload(path, img.file);
      if (uploadError) {
        setSubmitting(false);
        setError("사진 업로드에 실패했어요: " + uploadError.message);
        return;
      }
      const { data: urlData } = supabase.storage.from("post-images").getPublicUrl(path);
      imageUrls.push(urlData.publicUrl);
    }

    const { data, error: insertError } = await supabase
      .from("posts")
      .insert({
        title: title.trim(),
        content: content.trim(),
        category,
        user_id: userData.user.id,
        image_urls: imageUrls,
      })
      .select("id")
      .single();

    setSubmitting(false);

    if (insertError || !data) {
      setError(insertError?.message ?? "게시글 등록에 실패했어요.");
      return;
    }

    router.push(`/post/${data.id}`);
  };

  if (checkingAuth) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        <Header />
        <main style={{ flex: 1, textAlign: "center", padding: "80px 20px", color: "#a1a1aa" }}>확인 중...</main>
        <Footer />
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Header />

      <main style={{ flex: 1, padding: "32px 20px", maxWidth: "720px", margin: "0 auto", width: "100%" }}>
        <h1 style={{ margin: "0 0 24px", fontSize: "20px", fontWeight: "800" }}>✏️ 글쓰기</h1>

        <div style={{ background: "#fff", border: "1px solid #e4e4e7", borderRadius: "14px", padding: "28px" }}>
          {/* 카테고리 */}
          <div style={{ marginBottom: "20px" }}>
            <label style={{ fontSize: "13px", fontWeight: "600", color: "#3f3f46", display: "block", marginBottom: "10px" }}>채널 선택</label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              {categories.map(cat => (
                <button key={cat} onClick={() => setCategory(cat)} style={{
                  padding: "7px 14px", borderRadius: "20px",
                  border: `1px solid ${category === cat ? "#1a1a2e" : "#e4e4e7"}`,
                  background: category === cat ? "#1a1a2e" : "#fff",
                  color: category === cat ? "#fff" : "#52525b",
                  fontSize: "13px", cursor: "pointer", fontWeight: category === cat ? "600" : "400",
                }}>{cat}</button>
              ))}
            </div>
          </div>

          {/* 제목 */}
          <div style={{ marginBottom: "16px" }}>
            <input
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="제목을 입력하세요"
              maxLength={100}
              style={{
                width: "100%", padding: "12px 0",
                border: "none", borderBottom: "2px solid #e4e4e7",
                fontSize: "18px", fontWeight: "600", outline: "none",
                boxSizing: "border-box",
              }}
            />
            <p style={{ textAlign: "right", fontSize: "11px", color: "#a1a1aa", margin: "4px 0 0" }}>{title.length}/100</p>
          </div>

          {/* 본문 */}
          <div style={{ marginBottom: "20px" }}>
            <textarea
              value={content}
              onChange={e => setContent(e.target.value)}
              placeholder="내용을 입력하세요. 익명으로 게시됩니다.&#10;&#10;• 타인을 비방하거나 개인정보를 포함하지 마세요.&#10;• 허위 사실 유포 시 제재를 받을 수 있어요."
              rows={14}
              style={{
                width: "100%", border: "none", outline: "none",
                fontSize: "14px", lineHeight: "1.8", resize: "none",
                color: "#3f3f46", fontFamily: "inherit",
                boxSizing: "border-box",
              }}
            />
          </div>

          {/* 사진 첨부 */}
          <div style={{ marginBottom: "20px" }}>
            <label style={{ fontSize: "13px", fontWeight: "600", color: "#3f3f46", display: "block", marginBottom: "10px" }}>
              사진 첨부 ({images.length}/{MAX_IMAGES})
            </label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              {images.map((img, i) => (
                <div key={i} style={{ position: "relative", width: "80px", height: "80px" }}>
                  <img src={img.previewUrl} alt="" style={{ width: "80px", height: "80px", objectFit: "cover", borderRadius: "8px", border: "1px solid #e4e4e7" }} />
                  <button
                    onClick={() => removeImage(i)}
                    style={{
                      position: "absolute", top: "-6px", right: "-6px",
                      width: "20px", height: "20px", borderRadius: "50%",
                      background: "#1a1a2e", color: "#fff", border: "none",
                      fontSize: "12px", cursor: "pointer", lineHeight: "20px",
                    }}
                  >✕</button>
                </div>
              ))}
              {images.length < MAX_IMAGES && (
                <label style={{
                  width: "80px", height: "80px", borderRadius: "8px",
                  border: "1px dashed #d4d4d8", display: "flex",
                  alignItems: "center", justifyContent: "center",
                  cursor: "pointer", color: "#a1a1aa", fontSize: "24px",
                }}>
                  +
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    multiple
                    onChange={e => { handleFilesSelected(e.target.files); e.target.value = ""; }}
                    style={{ display: "none" }}
                  />
                </label>
              )}
            </div>
            <p style={{ fontSize: "11px", color: "#a1a1aa", margin: "8px 0 0" }}>JPG·PNG·WEBP·GIF, 장당 최대 5MB, 최대 {MAX_IMAGES}장</p>
          </div>

          {/* 익명 안내 */}
          <div style={{ background: "#f4f4f5", borderRadius: "8px", padding: "12px 16px", marginBottom: "20px", display: "flex", gap: "8px", alignItems: "center" }}>
            <span>🔒</span>
            <p style={{ margin: 0, fontSize: "12px", color: "#71717a" }}>
              모든 게시글은 <strong>익명</strong>으로 게시됩니다. 다른 이용자에게는 작성자 신원이 공개되지 않아요. (단, 법원 영장 등 적법한 절차에 따라 계정 정보가 제공될 수 있습니다)
            </p>
          </div>

          {error && <p style={{ color: "#e94560", fontSize: "13px", marginBottom: "16px" }}>{error}</p>}

          {/* 버튼 */}
          <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
            <button onClick={() => router.back()} style={{ padding: "11px 24px", background: "#f4f4f5", color: "#52525b", border: "none", borderRadius: "8px", fontSize: "14px", cursor: "pointer" }}>취소</button>
            <button
              onClick={handleSubmit}
              disabled={submitting}
              style={{ padding: "11px 28px", background: "#1a1a2e", color: "#fff", border: "none", borderRadius: "8px", fontSize: "14px", fontWeight: "700", cursor: "pointer" }}
            >{submitting ? "게시 중..." : "게시하기"}</button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
