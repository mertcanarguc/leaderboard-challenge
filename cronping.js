const cron = require('node-cron')
const moment = require('moment')
const User = require('./models/user')
const Pool = require('./models/pool')
moment.locale("tr")

//Her pazar saat 23:59'da skoru 0'ın üzerinde olan oyuncuların skorlarının %2'si havuzda toplanır.
// Ardından ilk 100'deki oyunculara aşağıdaki plana göre dağıtılır.
//       PLAN
// %20'si 1. oyuncuya
// %15'i  2. oyuncuya
// %10'u  3. oyuncuya
// Kalan %55 ise geriye kalan 97 oyuncuya sıralamalarına göre coin olarak dağıtılır.
// Dağıtma işlemi tamamlandıktan sonra. Skorlar silinir ve yeni hafta için havuz açılır. Döngü yeniden başlar.
cron.schedule('59 23 * * sun', async() => {
    let firstHundred = await User.find({}).limit(100).sort({ "live_score": -1 }).lean() //İlk 100 kullanıcı günlük skora göre
    let pool = await Pool.findOne({ weekNumber: moment().week(), year: moment().year() })
    let allUsers = await User.find({ last_day: { $ne: 0 }, live_score: { $ne: 0 } })
    let total_commission = 0
    allUsers.forEach(el => { total_commission = (total_commission + ((el.last_day + el.live_score) * 0.02)) });
    pool.update({ coin: total_commission.toFixed(0) }, (err, data) => { console.log(data) })
    let numerator = total_commission * 0.55 * 2
    let denominator = (firstHundred.length - 3) * (firstHundred.length - 3 + 1)
    let other = numerator / denominator
        // paylaştır
    firstHundred.map((value, index) => {
            if (index == 0) // 1. oyuncu
                User.findByIdAndUpdate(firstHundred[0]._id, { coin: firstHundred[0].coin + Number(total_commission * 0.20) }).then(response => { console.log(response) })
            else if (index == 1) // 2. oyuncu
                User.findByIdAndUpdate(firstHundred[1]._id, { coin: firstHundred[1].coin + Number(total_commission * 0.15) }).then(response => { console.log(response) })
            else if (index == 2) // 3. oyuncu
                User.findByIdAndUpdate(firstHundred[2]._id, { coin: firstHundred[2].coin + Number(total_commission * 0.10) }).then(response => { console.log(response) })
            else // diğer kalanlar
                User.findByIdAndUpdate(firstHundred[index]._id, { coin: firstHundred[index].coin + (Number(firstHundred.length - index) * (Number(other))) }).then(response => { console.log(response) })
        })
        //sıfırla
    for (let index = 0; index < allUsers.length; index++) {
        User.findByIdAndUpdate({ '_id': allUsers[index]._id }, { last_day: 0, live_score: 0 }).then(response => { console.log(response) })
    }
});


//Hergün 23:59 'da gün sonu skoru last_day ile eşitlenir, önceki güne göre sıralam yükselme azalma durumları buradan hesaplanmaktadır.
cron.schedule('58 23 * * *', async() => {
    let allUsers = await User.find({ last_day: { $ne: 0 }, live_score: { $ne: 0 } })
    for (let index = 0; index < users.length; index++) {
        User.findByIdAndUpdate({ '_id': allUsers[index]._id }, { last_day: allUsers[index].live_score }).then(response => { console.log(response) })
    }
});

//Her pazartesi 00:05'de yeni haftanın havuzu eklenir. Pazar gününe kadar bu pool ile bir iş yapılmayacaktır.
cron.schedule('05 00 * * mon', async() => {
    new Pool({
        weekNumber: moment.week(),
        year: moment.year()
    })
});