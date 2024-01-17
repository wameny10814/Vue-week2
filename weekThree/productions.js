import { createApp } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js';


let productModal;
let delProductModal;
let editModal;

const app = createApp({
    data(){
        return {

        products:[],
        addPorduct:{
            title:'',
            category:'',
            origin_price:'',
            price:'',
            unit:'',
            description:'',
            content:'',
            is_enabled:0,
            imageUrl:'',
            imagesUrl:[],
            id:'',
        },
        api:{
            key:'tsurusroute'

        },
        showmutiplePic:{
            addInput:[],
        },
        temp:{

        },
        deleteProduct:{},
        tempProduct:{
      
        },

        
        }
    },
    mounted(){
        // console.log('mounted');
        //登入成功拿剛剛存在cookie的token 用來驗證登入成功了沒
        const token = document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*=\s*([^;]*).*$)|^.*$/, '$1');
        // console.log('token',token);
        axios.defaults.headers.common.Authorization = token;

        productModal = new bootstrap.Modal(document.getElementById('exampleModal'), {
            keyboard: false
          });
        delProductModal = new bootstrap.Modal(document.getElementById('delProductModal'), {
        keyboard: false
        });
        editModal = new bootstrap.Modal(document.getElementById('editModal'), {
            keyboard: false
        });

        this.checklogined();



    },
    methods:{

        checklogined() {

            const api = 'https://ec-course-api.hexschool.io/v2/api/user/check';
            axios.post(api).then((response) => {
    
                // console.log('check login',response);
                //check 成功後叫產品資料
                this.getdata();
            
            }).catch((err) => {
                alert(err.data.message);
                window.location = 'login.html';

            });
        },
        getdata(){
            const api = 'https://ec-course-api.hexschool.io/v2/api/tsurusroute/admin/products/all';
            axios.get(api).then((response) => {
    
                // console.log('get products',response);
               this.products =response.data.products;
               
                

            }).catch((err) => {
                alert(err.data.message);
            });

        },
        getTemp(item){
            this.temp = item;
        },
        addmultiplePic(ModalType){
         
            //show出刪除按鈕
            //show出新增圖片input
          
            if(ModalType == 'exampleModal'){
          
                  this.showmutiplePic.addInput.push('');
            }else if(ModalType == 'editModal'){
           
                this.tempProduct.imagesUrl.push('');
            }
            
     
        },
    
        deletemultiplePic(ModalType){
        

            if(ModalType== 'exampleModal'){

                this.showmutiplePic.addInput.pop();
                this.addPorduct.imagesUrl.pop();

            }else if(ModalType== 'editModal'){
             
                this.tempProduct.imagesUrl.pop();

            }
            
        },
        addProduct(ModalType){
      

            if(ModalType =='exampleModal'){
                const api = 'https://ec-course-api.hexschool.io/v2/api/tsurusroute/admin/product';
                axios.post(api,{ data: this.addPorduct }).then((response) => {
        
              
                    //check 成功後叫產品資料
                    if(response.data.success == true){
                        alert(response.data.message);
                        productModal.hide();
                        //重刷新product資料
                        this.getdata();

                    }else{
                        alert(response.data.message)

                    }
                
                }).catch((err) => {
                    alert(err.data.message);
                });

            }else if (ModalType =='editModal'){


                const api = `https://ec-course-api.hexschool.io/v2/api/tsurusroute/admin/product/${this.tempProduct.id}`;
                axios.put(api,{ data: this.tempProduct }).then((response) => {
        
                    //check 成功後叫產品資料
                    if(response.data.success == true){
                        alert(response.data.message);
                        editModal.hide();
                        //重刷新product資料
                        this.getdata();

                    }else{
                        alert(response.data.message);
                    }
                
                }).catch((err) => {
                    alert(err.data.message);
                });

            }
     
            
        
        },
        editProduct(item){
         
            this.tempProduct = item;
            editModal.show();
        },
        showdeleteAlert(item){
            this.deleteProduct= item;
            delProductModal.show();

        },
        deletePorduct(){
       
            const api = `https://ec-course-api.hexschool.io/v2/api/tsurusroute/admin/product/${this.deleteProduct.id}`;
            axios.delete(api).then((response) => {
    
                // console.log('delete',response);
            
                if(response.data.success == true){
                    alert(response.data.message);
                    delProductModal.hide();
            
                    //重刷新product資料
                    this.getdata();

                }else{
                    alert(response.data.message)

                }
            
            }).catch((err) => {
                alert(err.data.message);
            });
        },

    },

    }
    );

app.mount('#app');