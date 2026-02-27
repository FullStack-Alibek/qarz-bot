const ADMIN_ID = Number(process.env.ADMIN_ID)

module.exports = (bot) => {

    // PHOTO (chek)
    bot.on("photo", async (ctx) => {
        try {
            const user = ctx.from

            const caption = `
📸 Yangi chek!

👤 User: ${user.first_name}
🆔 ID: ${user.id}
🔗 @${user.username || "username yo'q"}

Reply qilib tarif bering:
 /vip /premium /lifetime
            `

            // Adminga forward
            await ctx.telegram.sendPhoto(
                ADMIN_ID,
                ctx.message.photo.at(-1).file_id,
                { caption }
            )

            await ctx.reply("✅ Chek qabul qilindi. Tez orada tarif beriladi.")

        } catch (err) {
            console.error(err)
        }
    })

    // FILE (pdf, screenshot)
    bot.on("document", async (ctx) => {
        const user = ctx.from

        await ctx.telegram.sendDocument(
            ADMIN_ID,
            ctx.message.document.file_id,
            {
                caption: `📄 Yangi fayl\nID: ${user.id}\nReply qilib tarif bering`
            }
        )

        await ctx.reply("✅ Fayl qabul qilindi.")
    })
}