from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup, WebAppInfo
from telegram.ext import Application, CommandHandler, CallbackContext
from bot.config import BOT_TOKEN, APP_URL  # Изменен путь импорта

async def start(update: Update, context: CallbackContext):
    user_id = update.effective_user.id
    web_app_url = f"{APP_URL}?user_id={user_id}"
    
    keyboard = [[InlineKeyboardButton("Open Planner", web_app=WebAppInfo(url=web_app_url))]]
    reply_markup = InlineKeyboardMarkup(keyboard)
    
    await update.message.reply_text(
        "Добро пожаловать в PlannerBot! Нажмите кнопку ниже, чтобы открыть планировщик.",
        reply_markup=reply_markup
    )

def main():
    application = Application.builder().token(BOT_TOKEN).build()
    application.add_handler(CommandHandler("start", start))
    application.run_polling()

if __name__ == '__main__':
    main()