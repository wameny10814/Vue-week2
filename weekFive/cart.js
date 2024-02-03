

// console.log('表單驗證',VeeValidate);

// // 載入VeeValidate 規則
Object.keys(VeeValidateRules).forEach(rule => {
    if (rule !== 'default') {
      VeeValidate.defineRule(rule, VeeValidateRules[rule]);
    }
  });

// // 載入多國語系
VeeValidateI18n.loadLocaleFromURL("./zh_TW.json");
VeeValidate.configure({
  generateMessage: VeeValidateI18n.localize("zh_TW"),
  validateOnInput: true,
});



let userProductModal ;

const app = Vue.createApp({

    data(){
        return{
            url:{
                key:'tsurusroute',
                main:'https://ec-course-api.hexschool.io/v2',
            },
            products:[],
            tempproduct:{},
            addtocart:{},
            displayCartItem:{},
            updatedata:{
                product_id:'',
                qty:1,
            },
            form:{
                user:{
                    name:'',
                    email:'',
                    tel:'',
                    address:''

                },
                message:''

            }
        }
    },
    methods:{
         //自訂表單驗證規則
        isPhone(value) {
            const phoneNumber = /^(09)[0-9]{8}$/
            return phoneNumber.test(value) ? true : '需要正確的電話號碼'
        },
        onSubmit(){
            console.log('summit');

            const api = `${this.url.main}/api/${this.url.key}/order`;


            axios.post(api,{ data:  this.form }).then((res) => {

                if(res.data.success == true){

                    alert(res.data.message);

                    

                }else{
                    console.log('errrrr');
                }

            }).catch((err) => {
                alert(err.data.message);
                console.log('err',err);

            });



        },
        checklogined() {
            const api = 'https://ec-course-api.hexschool.io/v2/api/user/check';
            axios.post(api).then((res) => {

                //check 成功後叫第一頁產品資料

            

            }).catch((err) => {
                alert(err.data.message);
                window.location = 'login.html';

            });
        },

        getproducts(){

            const api = `${this.url.main}/api/${this.url.key}/products/all`;

            console.log('123');

            axios.get(api).then((res) => {

                console.log('res',res);
                this.products = res.data.products;

                //check 成功後叫第一頁產品資料
                // this.getpagination();

            }).catch((err) => {
                alert(err.data);

                console.log('err',err);
                // window.location = 'login.html';

            });
        },

        showdetail(item){
            console.log('clickd',item);
            this.tempproduct = item;
            userProductModal.show();

        },
        getaddtocart_detail(item){
            console.log('fdsfdf',item);
            this.addtocart = item;

            
            const api = `${this.url.main}/api/${this.url.key}/cart`;

            console.log('123');

            axios.post(api,{ data:  this.addtocart }).then((res) => {

                console.log('res',res);
                // this.products = res.data.products;
                // this.getpagination();
                if(res.data.success == true){
                    userProductModal.hide();
                    //打成功清空
                    this.addtocart={};
                    alert(res.data.message);
                    this.getcartlist();
                    

                }else{
                    console.log('errrrr');
                }

            }).catch((err) => {
                alert(err.data);
                console.log('err',err);

            });
        },
        additem(id){
            this.addtocart.product_id=id;
            this.addtocart.qty=1;

            const api = `${this.url.main}/api/${this.url.key}/cart`;

            console.log('123');

            axios.post(api,{ data:  this.addtocart }).then((res) => {

                console.log('res',res);
                // this.products = res.data.products;
                // this.getpagination();
                if(res.data.success == true){
                    userProductModal.hide();
                    //打成功清空
                    this.addtocart={};
                    alert(res.data.message);
                    this.getcartlist();
                    

                }else{
                    console.log('errrrr');
                }

            }).catch((err) => {
                alert(err.data);
                console.log('err',err);

            });

        },
        getcartlist(){
            console.log('getcartlist');

            const api = `${this.url.main}/api/${this.url.key}/cart`;

    

            axios.get(api).then((res) => {

                if(res.data.success == true){
                    this.displayCartItem =res.data.data;
                }

            }).catch((err) => {
                alert(err.data);

                console.log('err',err);
                // window.location = 'login.html';

            });
        },
        updatecart(item){
            console.log('updatecart',item);
   
            console.log('data',this.updatedata);

            const cart = {
                product_id: item.product_id,
                qty: item.qty,
              };

            const api = `${this.url.main}/api/${this.url.key}/cart/${item.id}`;
            axios.put(api,{ data:cart }).then((res) => {

                console.log('res',res);
                if(res.data.success == true){
                    this.getcartlist();
                    

                }else{
                    console.log('errrrr');
                }

            }).catch((err) => {
                alert(err.data);
                console.log('err',err);

            });

            

        },
        deleteall(){
            const api = `${this.url.main}/api/${this.url.key}/carts`;

    

            axios.delete(api).then((res) => {

                console.log('rrrr',res);

                if(res.data.success == true){
                this.getcartlist();
                }

            }).catch((err) => {
                alert(err.data);

                console.log('err',err);
                // window.location = 'login.html';

            });
        },
        deletecertainitem(id){
            console.log('deletecertainitem',id);

            const api = `${this.url.main}/api/${this.url.key}/cart/${id}`;

    

            axios.delete(api).then((res) => {

                console.log('delete',res);

                if(res.data.success == true){
                 
                this.getcartlist();
                }

            }).catch((err) => {
                alert(err.data);

                console.log('err',err);
                // window.location = 'login.html';

            });
        }

    },
    mounted(){

        userProductModal = new bootstrap.Modal(document.getElementById('productModal'), {
            keyboard: false
        });



        this.getproducts();

    },
    
});

app.component('userProductModal',{
    data(){
        return{
            addtocart:{
                "product_id":0,
                "qty":1,
            }
            
        }
    },
    methods:{

        emit(item) {
            console.log('emit',item);
            this.addtocart.product_id= item.id;
            //this.$emit('內層資料名稱','內層資料內容')
            this.$emit('inner-add-to-cart',this.addtocart);
        }

    },
    mounted(){
        //可以在這邊寫props 的資料進去component裡面的data
        // this.tempdata = this.temp;


    },
    props:["temp"],
    template:'#userProductModal',
});

app.component('VForm', VeeValidate.Form);
app.component('VField', VeeValidate.Field);
app.component('ErrorMessage', VeeValidate.ErrorMessage);

app.mount('#app');