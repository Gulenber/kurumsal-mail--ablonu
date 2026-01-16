import React, { useMemo, useState } from "react";
import { Copy, Check, Code2 } from "lucide-react";

function safeText(s) {
  return (s ?? "").toString();
}

function displayUrl(u) {
  return safeText(u).replace(/^https?:\/\//i, "").replace(/\/$/, "");
}

// Fotoğrafı otomatik küçült (base64) — imza şişmesin diye
async function resizeImageToDataUrl(file, maxSize = 300, quality = 0.8) {
  const dataUrl = await new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(r.result);
    r.onerror = reject;
    r.readAsDataURL(file);
  });

  const img = await new Promise((resolve, reject) => {
    const i = new Image();
    i.onload = () => resolve(i);
    i.onerror = reject;
    i.src = dataUrl;
  });

  const scale = Math.min(maxSize / img.width, maxSize / img.height, 1);
  const w = Math.round(img.width * scale);
  const h = Math.round(img.height * scale);

  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;

  const ctx = canvas.getContext("2d");
  ctx.drawImage(img, 0, 0, w, h);

  return canvas.toDataURL("image/jpeg", quality);
}

export default function App() {
  const [copied, setCopied] = useState(false);
  const [showHtml, setShowHtml] = useState(false);

  const [formData, setFormData] = useState({
    name: "Gülenber",
    surname: "Enginöz",
    title: "AIO Specialist",
    phone: "+905318556371",
    email: "gulenberhan@cremicro.com",
    website1: "https://cremicro.com",
    website2: "",
    address1: "Kustepe Mah Mesut Cemil Sok No:20 Sisli Istanbul",
    address2: "",
    photoUrl: "",
    logoUrl: "" // LOGO_URL_BURAYA
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const resized = await resizeImageToDataUrl(file, 300, 0.82);
      setFormData((p) => ({ ...p, photoUrl: resized }));
    } catch (err) {
      console.error(err);
      alert("Fotoğraf yüklenemedi. Lütfen başka bir görsel deneyin.");
    }
  };

  const generateSignatureHTML = () => {
    const name = safeText(formData.name);
    const surname = safeText(formData.surname);
    const initials = `${name.charAt(0)}${surname.charAt(0)}`.toUpperCase();

    const phoneHref = safeText(formData.phone).replace(/\s+/g, "");

    // Not: mail istemcileri için tablo + inline style en stabil yöntem.
    return `<table cellpadding="0" cellspacing="0" border="0" style="font-family: Arial, sans-serif; font-size: 14px; line-height: 1.4; color: #333;">
  <tr>
    <td style="padding-right: 18px; vertical-align: top;">
      ${
        formData.photoUrl
          ? `<img src="${formData.photoUrl}" alt="${name} ${surname}" style="width: 90px; height: 90px; border-radius: 50%; object-fit: cover; display: block;">`
          : `<div style="width: 90px; height: 90px; border-radius: 50%; background: linear-gradient(135deg, #0B5A7D 0%, #6B4FBB 50%, #4F46E5 100%); display: flex; align-items: center; justify-content: center; color: white; font-size: 28px; font-weight: bold;">
              ${initials}
            </div>`
      }
    </td>

    <td style="vertical-align: top; padding-right: 22px;">
      <div style="margin-bottom: 6px;">
        <span style="font-size: 18px; font-weight: 600; color: #0B5A7D;">${name} ${surname}</span>
      </div>
      <div style="font-size: 13px; color: #666;">${safeText(formData.title)}</div>
    </td>

    <td style="vertical-align: top; padding-left: 22px; border-left: 2px solid #0B5A7D;">
      ${
        formData.phone
          ? `<div style="margin-bottom: 4px;">
              <span style="color: #0B5A7D; margin-right: 8px;">📞</span>
              <a href="tel:${phoneHref}" style="color: #333; text-decoration: none;">${safeText(formData.phone)}</a>
            </div>`
          : ""
      }

      ${
        formData.email
          ? `<div style="margin-bottom: 4px;">
              <span style="color: #0B5A7D; margin-right: 8px;">✉️</span>
              <a href="mailto:${safeText(formData.email)}" style="color: #333; text-decoration: none;">${safeText(formData.email)}</a>
            </div>`
          : ""
      }

      ${
        formData.website1
          ? `<div style="margin-bottom: 4px;">
              <span style="color: #0B5A7D; margin-right: 8px;">🌐</span>
              <a href="${safeText(formData.website1)}" style="color: #0B5A7D; text-decoration: none;">${displayUrl(formData.website1)}</a>
            </div>`
          : ""
      }

      ${
        formData.website2
          ? `<div style="margin-bottom: 4px;">
              <span style="color: #0B5A7D; margin-right: 8px;">🌐</span>
              <a href="${safeText(formData.website2)}" style="color: #0B5A7D; text-decoration: none;">${displayUrl(formData.website2)}</a>
            </div>`
          : ""
      }

      ${
        formData.address1
          ? `<div style="margin-bottom: 4px;">
              <span style="color: #0B5A7D; margin-right: 8px;">📍</span>
              <span style="color: #666; font-size: 12px;">${safeText(formData.address1)}</span>
            </div>`
          : ""
      }

      ${
        formData.address2
          ? `<div style="margin-bottom: 4px;">
              <span style="color: #0B5A7D; margin-right: 8px;">📍</span>
              <span style="color: #666; font-size: 12px;">${safeText(formData.address2)}</span>
            </div>`
          : ""
      }
    </td>
  </tr>

  <tr>
    <td colspan="3" style="padding-top: 14px;">
      <div style="border-top: 1px solid #ddd; padding-top: 10px;">
        ${
          formData.logoUrl
            ? `<img src="${safeText(formData.logoUrl)}" alt="CREMICRO" style="height: 40px; display: block;">`
            : ""
        }
      </div>
    </td>
  </tr>
</table>`;
  };

  const signatureHTML = useMemo(() => generateSignatureHTML(), [formData]);

  const copyToClipboard = async () => {
    const html = signatureHTML;

    // 1) HTML olarak kopyalamayı dene (Gmail için en iyi)
    try {
      const blob = new Blob([html], { type: "text/html" });
      const item = new ClipboardItem({ "text/html": blob });
      await navigator.clipboard.write([item]);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
      return;
    } catch (e) {
      // devam et
    }

    // 2) Fallback: plain text copy (en azından HTML'yi taşırsın)
    try {
      await navigator.clipboard.writeText(html);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (e) {
      // 3) Son çare
      const textarea = document.createElement("textarea");
      textarea.value = html;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  return (
    <div className="container">
      <div className="card" style={{ marginBottom: 18 }}>
        <h1 className="h1">Kurumsal E-posta İmza Oluşturucu</h1>
        <p className="sub">Bilgileri doldurun, imzayı kopyalayıp Gmail’e yapıştırın.</p>

        <div className="grid">
          {/* FORM */}
          <div className="card" style={{ boxShadow: "none" }}>
            <label className="label">Profil Fotoğrafı (opsiyonel)</label>
            <input type="file" accept="image/*" onChange={handleImageUpload} className="input" />

            <div className="row2">
              <div>
                <label className="label">Ad</label>
                <input name="name" value={formData.name} onChange={handleChange} className="input" />
              </div>
              <div>
                <label className="label">Soyad</label>
                <input name="surname" value={formData.surname} onChange={handleChange} className="input" />
              </div>
            </div>

            <label className="label">Ünvan</label>
            <input name="title" value={formData.title} onChange={handleChange} className="input" />

            <label className="label">Telefon</label>
            <input name="phone" value={formData.phone} onChange={handleChange} className="input" placeholder="+90..." />

            <label className="label">E-posta</label>
            <input name="email" value={formData.email} onChange={handleChange} className="input" placeholder="ornek@cremicro.com" />

            <label className="label">Web Sitesi 1</label>
            <input name="website1" value={formData.website1} onChange={handleChange} className="input" placeholder="https://..." />

            <label className="label">Web Sitesi 2</label>
            <input name="website2" value={formData.website2} onChange={handleChange} className="input" placeholder="https://..." />

            <label className="label">Adres 1</label>
            <input name="address1" value={formData.address1} onChange={handleChange} className="input" />

            <label className="label">Adres 2</label>
            <input name="address2" value={formData.address2} onChange={handleChange} className="input" />

            <label className="label">Logo URL (opsiyonel)</label>
            <input name="logoUrl" value={formData.logoUrl} onChange={handleChange} className="input" placeholder="https://.../logo.png" />
          </div>

          {/* PREVIEW */}
          <div className="card" style={{ boxShadow: "none" }}>
            <div style={{ fontWeight: 800, marginBottom: 10 }}>Önizleme</div>

            <div className="previewBox">
              <div dangerouslySetInnerHTML={{ __html: signatureHTML }} />
            </div>

            <button className="btn btnPrimary" onClick={copyToClipboard} style={{ marginTop: 12 }}>
              {copied ? <Check size={18} /> : <Copy size={18} />}
              {copied ? "Kopyalandı" : "İmzayı Kopyala"}
            </button>

            <button className="btn btnSecondary" onClick={() => setShowHtml((s) => !s)}>
              <Code2 size={18} />
              {showHtml ? "HTML'yi Gizle" : "HTML'yi Göster"}
            </button>

            {showHtml && (
              <textarea
                className="textarea"
                style={{ marginTop: 10, minHeight: 220, fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace", fontSize: 12 }}
                value={signatureHTML}
                readOnly
              />
            )}

            <div className="note">
              <b>Kullanım:</b> Gmail → Ayarlar → “İmza” alanına yapıştırın. Eğer tarayıcı HTML kopyalamazsa, “HTML’yi Göster” içeriğini kopyalayıp deneyin.
            </div>
          </div>
        </div>
      </div>

      <div style={{ color: "#64748b", fontSize: 12 }}>
        Not: Bazı e-posta istemcileri farklı render edebilir. Tablo + inline style en stabil yaklaşımdır.
      </div>
    </div>
  );
}
