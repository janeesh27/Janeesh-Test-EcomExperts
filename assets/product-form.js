// start-ECOM

if (!customElements.get("product-form")) {
  customElements.define(
    "product-form",
    class ProductForm extends HTMLElement {
      constructor() {
        super();

        this.form = this.querySelector("form");
        this.form.querySelector("[name=id]").disabled = false;
        this.form.addEventListener("submit", this.onSubmitHandler.bind(this));
        this.cart =
          document.querySelector("cart-notification") ||
          document.querySelector("cart-drawer");
        this.submitButton = this.querySelector('[type="submit"]');
        if (document.querySelector("cart-drawer"))
          this.submitButton.setAttribute("aria-haspopup", "dialog");
      }

      addLeatherJacket(config) {
        const formDataLatest = new FormData();

        formDataLatest.append("form_type", "product");

        formDataLatest.append("id", 44745443606846);

        formDataLatest.append("options[]", "Large");

 //       formDataLatest.append("oseid", "DJUgDmxWALHarCMgNuQZKdCc");

        formDataLatest.append("quantity", 1);

        formDataLatest.append(
          "sections",
          "cart-notification-product,cart-notification-button,cart-icon-bubble"
        );
      //  formDataLatest.append("Price", 0.001);
      //  formDataLatest.append("price", 0.001);
        formDataLatest.append("sections_url", "/products/dark-winter-jacket");

        config.body = formDataLatest;
        this.fetchHandler(config);
      }

      onSubmitHandler(evt) {
        evt.preventDefault();
        if (this.submitButton.getAttribute("aria-disabled") === "true") return;

        this.handleErrorMessage();

        this.submitButton.setAttribute("aria-disabled", true);
        this.submitButton.classList.add("loading");
        this.querySelector(".loading-overlay__spinner").classList.remove(
          "hidden"
        );

        const config = fetchConfig("javascript");
        config.headers["X-Requested-With"] = "XMLHttpRequest";
        delete config.headers["Content-Type"];

        const config2 = fetchConfig("javascript");
        config2.headers["X-Requested-With"] = "XMLHttpRequest";
        delete config2.headers["Content-Type"];


        const formData = new FormData(this.form);
        if (this.cart) {
          formData.append(
            "sections",
            this.cart.getSectionsToRender().map((section) => section.id)
          );
          formData.append("sections_url", window.location.pathname);
          this.cart.setActiveElement(document.activeElement);
        }


        const formDataObj = {};
        formData.forEach((value, key) => (formDataObj[key] = value));
     
 // formDataObj.Size === "Medium"

        if (
          formDataObj.Color === "Black" && formDataObj.Size === "Medium"
        
        ) {
          setTimeout(() => {
            this.addLeatherJacket(config2);
          }, 1000);
        }
        formData.delete("Size");
        formData.append('options[Size]', formDataObj.Size)
          const formDataObj2 = {};
        formData.forEach((value, key) => (formDataObj2[key] = value));
        console.log('2122',formDataObj2)
        config.body = formData;

        this.fetchHandler(config,formDataObj.Size);
      }

      fetchHandler = (config,Size) => {
         console.log('ayush',this.cart);
        fetch(`${routes.cart_add_url}`, config)
          .then((response) => response.json())
          .then((response) => {
            document.querySelector('.cart-notification').classList.add('animate', 'active');
      
  setTimeout(() => {
            document.querySelector('.raja').innerHTML=`<dt> Size:</dt>
             <dd>${ Size }</dd>`
          }, 100);     
            if (response.status) {
      
              this.handleErrorMessage(response.description);

              const soldOutMessage =
                this.submitButton.querySelector(".sold-out-message");
              if (!soldOutMessage) return;
              this.submitButton.setAttribute("aria-disabled", true);
              this.submitButton.querySelector("span").classList.add("hidden");
              soldOutMessage.classList.remove("hidden");
              this.error = true;
              return;
            } else if (!this.cart) {
              window.location = window.routes.cart_url;
              return;
            }
            

            if (!this.error)
              publish(PUB_SUB_EVENTS.cartUpdate, { source: "product-form" });
            this.error = false;
            const quickAddModal = this.closest("quick-add-modal");
            if (quickAddModal) {
                      document.querySelector("cart-drawer").renderContents(response);
                document.querySelector("cart-notification").renderContents(response);
console.log('aaa',response)
              document.body.addEventListener(
                "modalClosed",
                () => {
                  setTimeout(() => {
                    this.cart.renderContents(response);
                  });
                },
                { once: true }
              );
              quickAddModal.hide(true);
            } else {
              
              this.cart.renderContents(response);
            }
            
          })
          .catch((e) => {
            console.error(e);
          })
          .finally(() => {
            this.submitButton.classList.remove("loading");
            if (this.cart && this.cart.classList.contains("is-empty"))
              this.cart.classList.remove("is-empty");
            if (!this.error) this.submitButton.removeAttribute("aria-disabled");
            this.querySelector(".loading-overlay__spinner").classList.add(
              "hidden"
            );
          });
      };

      handleErrorMessage(errorMessage = false) {
        this.errorMessageWrapper =
          this.errorMessageWrapper ||
          this.querySelector(".product-form__error-message-wrapper");
        if (!this.errorMessageWrapper) return;
        this.errorMessage =
          this.errorMessage ||
          this.errorMessageWrapper.querySelector(
            ".product-form__error-message"
          );

        this.errorMessageWrapper.toggleAttribute("hidden", !errorMessage);

        if (errorMessage) {
          this.errorMessage.textContent = errorMessage;
        }
      }
    }
  );
}

//end-ECOM
