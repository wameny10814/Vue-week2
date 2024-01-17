import { createApp } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js';

const app = createApp({
    data(){
        return {
        textt:'test',
        ueserData:{
            username:'',
            password:'',
        }

        
        }
    },
    methods:{

        login() {
       
        const api = 'https://ec-course-api.hexschool.io/v2/admin/signin';
        axios.post(api, this.ueserData).then((response) => {

          
            const { token, expired } = response.data;
            //cookie 放token 跟 過期期限
            
            document.cookie = `hexToken=${token};expires=${new Date(expired)}; path=/`;
            window.location = 'homework_product.html';
        }).catch((err) => {
            alert(err.response.data.message);
        });
        },

    },
    mounted(){
        //初始化後第一個執行的方法
        //vue觸發getData ->this.getData
        //原生js 為 this.methods.getData
    }
    }
    );

app.mount('#app');
