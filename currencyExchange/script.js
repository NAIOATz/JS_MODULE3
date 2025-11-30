// ดึง dropdown
const currency_one=document.getElementById('currency-one');
const currency_two=document.getElementById('currency-two');

// ดึง Input
const amount_one=document.getElementById('amount-one');
const amount_two=document.getElementById('amount-two');

// ค่าเรทการแลกเปลี่ยน
const rateText=document.getElementById('rate');
const swap=document.getElementById('btn');

// เพิ่ม event
currency_one.addEventListener('change',calculateMoney);
currency_two.addEventListener('change',calculateMoney);
amount_one.addEventListener('input',calculateMoney);
amount_two.addEventListener('input',calculateMoney);

// สร้าง func ที่ทำการแปลงค่าตามสกุลเงิน
function calculateMoney(){
    const one = currency_one.value;
    const two = currency_two.value;
    fetch(`https://api.exchangerate-api.com/v4/latest/${one}`)
    .then(res=>res.json()).then(data=>{
        const rate=data.rates[two];
        rateText.innerText=`1 ${one} = ${rate} ${two}`;
        amount_two.value=(amount_one.value*rate).toFixed(2);
    })
}
swap.addEventListener('click',()=>{
    // USD => THB || THB => USD 
    // TEMP => USD || THB = TEMP (USD)
    const temp = currency_one.value; // ต้นทาง
    currency_one.value=currency_two.value;
    currency_two.value = temp;
    calculateMoney();
})

calculateMoney();