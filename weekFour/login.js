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
        // console.log('acc',this.ueserData.account);
        // console.log('acc',this.ueserData.psd);
        const api = 'https://ec-course-api.hexschool.io/v2/admin/signin';
        axios.post(api, this.ueserData).then((response) => {

            // console.log('response',response);
            const { token, expired } = response.data;
            //cookie 放token 跟 過期期限
            
            document.cookie = `hexToken=${token};expires=${new Date(expired)}; path=/`;
            window.location = 'productions.html';
        }).catch((err) => {
            console.log('err',err);
            alert(err.data.message);
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