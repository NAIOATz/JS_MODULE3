import { Dialog } from "../ui/ui";

/**
 * ***คำสั่งภายใน ห้ามExport*** ใช้สำหรับแปลง Response ที่ได้จาก Backend
 * @param {json} res 
 * @returns {object}
 */
async function parseResponse(res){
const text = await res.text();
  let json = null;
  if (text) {
    try {
      json = JSON.parse(text);
    } catch {
      json = text;
    }
  }

  if (res.ok) {
    return {
      ok: true,
      status: res.status,
      data: json,
    };
  }

  return {
    ok: false,
    status: res.status,
    error: json && typeof json === "object" ? json.error : undefined,
    message: json && typeof json === "object" ? json.message : undefined,
    body: json,
  };
}
//fetch API
/**
 * getitems ใช้สำหรับ method get เท่านั้น
 * @param {string} url ต้องการ url ที่ให้ fetch ไปถามหา
 * @return {json} มอบ body res.json() ออกมาให้ || หากไม่สำเร็จ จะส่งรหัส statuscode เช่น 404,405,500
 * @throws err ที่พบปัญหา
 */
export async function getItems(url) {
  try {
    const res = await fetch(url);
    const result = await parseResponse(res);
    if (!result.ok) {
      switch (result.status) {
        case 500:
        case 502: Dialog("There is a problem. Please try again later."); break;
        default: return result.status;
      }
    }
    return await result;
  } catch (err) {
    Dialog("There is a problem. Please try again later.")
  }
}

/**
 * postItems ใช้สำหรับ method post เท่านั้น
 * @param {string} url ต้องการ url ที่ให้ fetch ส่ง
 * @param {object} bodyobj รับ body ที่ต้องการส่งไปให้ backend
 * @return {json} มอบ body res.json() ออกมาให้ || หากไม่สำเร็จ จะส่งรหัส statuscode เช่น 404,405,500
 * @throws err ที่พบปัญหา
 */
export async function postItems(url, bodyobj) {
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bodyobj)
    });
    const result = await parseResponse(res);
    if (!result.ok) {
      switch (result.status) {
        case 500:
        case 502: Dialog("There is a problem. Please try again later.");break;
      }
    }
    return await result;
  } catch (err) {
    Dialog("There is a problem. Please try again later.")
  }
}


export async function putItems(url, bodyobj) {
  try{
    const res = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bodyobj)
    });
    const result = await parseResponse(res);
    if (!result.ok) {
      switch (result.status) {
        case 500:
        case 502: Dialog("There is a problem. Please try again later."); break;
      }
    }
    return await result.json();
  }catch(err){
    Dialog("There is a problem. Please try again later.");
  }
}

export async function deleteItems(params) {
    try{
    const res = await fetch(url, {
      method: "DELETE",
    });
    const result = await parseResponse(res);
    if (!result.ok) {
      switch (result.status) {
        case 500:
        case 502: Dialog("There is a problem. Please try again later.");break;
      }
    }
    return await result;
  }catch(err){
    Dialog("There is a problem. Please try again later.");
  }
}