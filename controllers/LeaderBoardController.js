const User = require('../models/user')

// HER GÜNÜN SONUNDA KİŞİNİN REDİSTE BİRİKEN SCORE'U weekly_score eklenecek (redis ve socket)
// HER HAFTA BİTİMİNDE SCORE'LAR PAYLAŞTIRILACAK VE OYUNCULARA COİN OLARAK EKLENECEK ARDINDAN YENİ HAFTA İÇİN HAVUZ AÇILIP USER'LAR DA weekly_score ve live_score hesaplanacak

exports.first_hundred = async(req, res, next) => {
    let firstHundred = await User.find({}).limit(100).sort({ "live_score": -1 }).lean() //İlk 100 kullanıcı günlük skora göre
    let yesterdayFirstHundred = await User.find({ _id: { $in: firstHundred.map(m => m._id) } }).lean()
    firstHundred = firstHundred.map((value, index) => {
        value.gap = ((yesterdayFirstHundred.findIndex(x => x._id.toString() == value._id.toString()) + 1) - (index + 1))
        return value
    })
    let currentUser = await User.findById({ "_id": req.body.id }).lean() //Mevcut kullanıcı
    let allUsers = await User.find({}).sort({ "live_score": -1 }).lean() //Tüm kullanıcılar (sırasına göre)
    let currentUserSort = allUsers.map((o) => o._id.toString()).indexOf(req.body.id.toString()) + 1 // Mevcut kullanıcının sırası
    let three_front_two_rear = {}
    if (currentUserSort <= 3) {
        three_front_two_rear = await User.find({}).sort({ "live_score": -1 }).skip(currentUserSort).limit(2).lean() //Mevcut kullanıcının 3 önü 2 arkasındaki oyunları getirdik
    } else {
        three_front_two_rear = await User.find({}).sort({ "live_score": -1 }).skip(currentUserSort - 3).limit(6).lean() //Mevcut kullanıcının 3 önü 2 arkasındaki oyunları getirdik
    }
    let three_front = await three_front_two_rear.slice(0, 3) // 3 önündeki kullanıcılar
    let two_rear = await three_front_two_rear.slice(4, 6) // 2 arkasındaki kullanıcılar
    res.json({
        status: true,
        result: {
            first_hundred: firstHundred,
            current_user: currentUser,
            currentUserSort: currentUserSort,
            three_front: three_front,
            two_rear: two_rear
        }
    })
}