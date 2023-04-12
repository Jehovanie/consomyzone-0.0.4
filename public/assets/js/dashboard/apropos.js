if( document.querySelector(".validating_super_admin_tributG_js_jheo")){

    const btn_validating =  document.querySelectorAll(".validating_super_admin_tributG_js_jheo");







    btn_validating.forEach(btn => {



        btn.addEventListener("click" , ( ) => {

            const categories = btn.getAttribute("data-toggle-categories");

            const user_id = btn.getAttribute("data-toggle-id");

            const value = btn.getAttribute("id");



            /// (ex: "/admin/validate_tributG?categories=fondateur&user_id=4&value=0" )

            fetch("/admin/validate_tributG?categories="+categories+"&user_id="+user_id +"&value="+ value )

                .then(r => r.json())

                .then(response  => { /// 0 or 1 

                   

                    //tow btn to validate user who is begin administrator

                    const cta_btn= document.querySelectorAll(".validating_super_admin_tributG_js_jheo");



                    ///to make icon dynamique change the status

                    const icon_danger= document.querySelector(".icon_danger_validate_js_jheo")

                    const icon_success= document.querySelector(".icon_success_validate_js_jheo")



                    /// if we send no validate ie click on "non"

                    if( parseInt(response) === 0) {



                        /// show icon alert (not valid)

                        icon_danger.classList.remove("d-none")



                        /// hide icon success (already valid)

                        icon_success.classList.add("d-none")



                        /// iteration the two cta ("non" "oui")

                        cta_btn.forEach(btn => {

                            

                            ///disabled the btn (non) because actual the user is not valid.

                            if( btn.getAttribute("id") === "0"){

                                btn.disabled= true;

                            

                            //// activate the btn (oui)

                            }else{

                                btn.disabled= false;

                            }

                        })

                    }else{

                        /// hide icon alert (not valid)

                        icon_danger.classList.add("d-none")



                        /// show icon success (already valid)

                        icon_success.classList.remove("d-none")



                        /// iteration the two cta ("non" "oui")

                        cta_btn.forEach(btn => {



                            ///activate the btn (non) because actual the user is  valid.

                            if( btn.getAttribute("id") === "0"){

                                btn.disabled= false;

                            

                            //// disable the btn (oui)

                            }else{

                                btn.disabled= true;

                            }

                        })

                    }



            })

        })

    })



}





if(document.querySelector(".validating_super_admin_fournisseur_js_jheo")) {

    const btn = document.querySelector(".validating_super_admin_fournisseur_js_jheo")

    btn.addEventListener("click", () => {

        const id = btn.getAttribute("data-toggle-id");



        fetch("/user/validate/fournisseur?id=" + parseInt(id))

            .then(res => res.json())

            .then(response => {
                // console.log(response)
                document.querySelector(".validating_super_admin_fournisseur_js_jheo").innerText = "Non"
            })

    })

}