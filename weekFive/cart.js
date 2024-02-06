

// console.log('表單驗證',VeeValidate);
// console.log('vue loading',VueLoading)

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
            loadinStatus:false,
            deleteLoadingStatus:false,
            isLoading:true,
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
            
            const api = `${this.url.main}/api/${this.url.key}/order`;

            if(this.displayCartItem.carts.length !==0){
                axios.post(api,{ data:  this.form }).then((res) => {

                    alert(res.data.message);
                    this.getcartlist();

                }).catch((err) => {
                    alert(err.data.message);
                    console.log('err',err);

                });

            }else{
                alert('購物車為空')
            }


        



        },

        getproducts(){
            const api = `${this.url.main}/api/${this.url.key}/products/all`;

            axios.get(api).then((res) => {
                this.isLoading =false;
                this.products = res.data.products;
            }).catch((err) => {
                alert(err.data);
                this.isLoading =false;
                console.log('err',err);

            });
        },

        showdetail(item){
            this.tempproduct = item;
            userProductModal.show();
            this.loadinStatus = true;

        },
        getaddtocart_detail(item){

            this.addtocart = item;
            const api = `${this.url.main}/api/${this.url.key}/cart`;

            axios.post(api,{ data:  this.addtocart }).then((res) => {
                    userProductModal.hide();
                    //打成功清空
                    this.addtocart={};
                    alert(res.data.message);
                    this.loadinStatus = false;
                    this.getcartlist();
            }).catch((err) => {
                alert(err.data);
                console.log('err',err);
                this.loadinStatus = false;

            });
        },
        additem(id){
            this.loadinStatus = true;
            this.addtocart.product_id=id;
            this.addtocart.qty=1;

            const api = `${this.url.main}/api/${this.url.key}/cart`;

            axios.post(api,{ data:  this.addtocart }).then((res) => {
                this.loadinStatus = false;
                userProductModal.hide();
                //打成功清空
                this.addtocart={};
                alert(res.data.message);
                this.getcartlist();

            }).catch((err) => {
                alert(err.data);
                console.log('err',err);
                this.loadinStatus = false;

            });

        },
        getcartlist(){
            const api = `${this.url.main}/api/${this.url.key}/cart`;

            axios.get(api).then((res) => {

                this.displayCartItem =res.data.data;

            }).catch((err) => {
                alert(err.data);
                console.log('err',err);

            });
        },
        updatecart(item){
            this.isLoading = true;

            const cart = {
                product_id: item.product_id,
                qty: item.qty,
              };

            const api = `${this.url.main}/api/${this.url.key}/cart/${item.id}`;
            axios.put(api,{ data:cart }).then((res) => {
                    this.getcartlist();
                    this.isLoading = false;
            }).catch((err) => {
                alert(err.data);
                console.log('err',err);
                this.isLoading = false;

            });

            

        },
        deleteall(){
            const api = `${this.url.main}/api/${this.url.key}/carts`;
            axios.delete(api).then((res) => {
                this.getcartlist();
            }).catch((err) => {
                alert(err.data);
                console.log('err',err);


            });
        },
        deletecertainitem(id){
            this.deleteLoadingStatus =true;
            const api = `${this.url.main}/api/${this.url.key}/cart/${id}`;

    

            axios.delete(api).then((res) => {
                this.getcartlist();
                this.deleteLoadingStatus =false;
            }).catch((err) => {
                alert(err.data);
                this.deleteLoadingStatus =false;
                console.log('err',err);


            });
        }

    },
    mounted(){

        userProductModal = new bootstrap.Modal(document.getElementById('productModal'), {
            keyboard: false
        });

        this.getproducts();
        this.getcartlist();

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

app.use(VueLoading.LoadingPlugin);
app.component('loading', VueLoading.Component)

app.mount('#app');