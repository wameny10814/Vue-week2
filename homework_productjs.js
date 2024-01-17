import { createApp } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js';


const app = createApp({
    data(){
        return {

        products:[
        ],
        api:{
            key:'tsurusroute'

        },
        temp:{

        },
        countingItem:0,

        }
    },
    methods:{

        checklogined() {

            const api = 'https://vue3-course-api.hexschool.io/v2/api/user/check';
            axios.post(api).then((response) => {
    
              
                //check 成功後叫產品資料
                this.getdata();
            
            }).catch((err) => {
                alert(err.data.message);
            });
        },
        getdata(){
            const api = 'https://ec-course-api.hexschool.io/v2/api/tsurusroute/admin/products/all';
            axios.get(api).then((response) => {
    
              
               this.products =response.data.products;
               this.counting();
                

            }).catch((err) => {
                alert(err.response.data.message);
            });

        },
        getTemp(item){
            this.temp = item;
        },
        counting(){
            console.log('products',this.products);

            const getLengthOfObject =
                (obj) => {
                    let lengthOfObject = Object.keys(obj).length;
                    console.log('counting',lengthOfObject);
                    this.countingItem = lengthOfObject;
                }

            getLengthOfObject(this.products);

        }

    },
    mounted(){
     
        //登入成功拿剛剛存在cookie的token 用來驗證登入成功了沒
        const token = document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*=\s*([^;]*).*$)|^.*$/, '$1');
        axios.defaults.headers.common.Authorization = token;
        this.checklogined();

    }
    }
    );

app.mount('#app');