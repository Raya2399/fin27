import fetch from 'node-fetch'

let timeout = 120000
let poin = 1999
let handler = async (m, { conn, usedPrefix, isPrems }) => {
    let chat = global.db.data.chats[m.chat]
    if (!chat.game && m.isGroup) return
    conn.tebakbendera = conn.tebakbendera ? conn.tebakbendera : {}
    let id = m.chat
    if (id in conn.tebakbendera) {
        conn.reply(m.chat, 'Masih Ada Soal Yang Belum Terjawab', conn.tebakbendera[id][0])
        throw false
    }
    if (global.db.data.users[m.sender].limit < 1 && global.db.data.users[m.sender].money > 50000 && !isPrems) {
        throw `Beli limit dulu lah, duid lu banyak kan`
    } else if (global.db.data.users[m.sender].limit > 0 && !isPrems) {
        global.db.data.users[m.sender].limit -= 1
    } else {

    }
    let res = await fetch(`https://api.tiodevhost.my.id/api/game/tembakbendera`)
    if (!res.ok) throw 'Fitur Error!'
    let json = await res.json()
    let caption = `
🎮 *Tebak Bendera* 🎮

⭔ Timeout *${(timeout / 1000).toFixed(2)} detik*
⭔ Bonus: ${poin} Exp
`.trim()
    conn.tebakbendera[id] = [
        await conn.sendMessage(m.chat, { image: { url: json.result.img }, caption: caption }, { quoted: m }),
        json, poin,
        setTimeout(() => {
            if (conn.tebakbendera[id]) conn.sendButton(m.chat, `Waktu habis!\nJawabannya adalah *${json.result.name}*`, packname + ' - ' + author, ['Main Lagi', `${usedPrefix}tebakbendera`], conn.tebakbendera[id][0])
            delete conn.tebakbendera[id]
        }, timeout)
    ]
    console.log(json.result.name)
}

handler.menufun = ['tebakbendera (exp+)']
handler.tagsfun = ['game']
handler.command = /^(tebakbendera)$/i

handler.limit = true

export default handler