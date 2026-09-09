var welcome_message ;
var invalid_message ;
var countdownTimer ;
let url_campaign_data ;
let hottrix_websocket_service ="wss://desk.hottrix.in:4434";
let base_url_hottrix_custom_hemant ='https://desk.hottrix.in/modules/hotbot_version_two/';
let isChatOn_;



let hottrix_chat_interfae_Html = `
<div class="chat-title" style="position:fixed ;z-index:9999">Connect With UsðŸ‘‹</div>
<div id="chatbot" class="main-card collapsed" style=" z-index: 9999!important;">
    <div class="chat-wave"></div>
    <div class="main-title">
        <button id="chatbot_toggle">
            <img id="chatIcon" src="https://desk.hottrix.in/modules/hotbot/assets/chatbot.png" style="width:36px">

            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                id="chatCloseIcon">
                <path d="M4 12h16"></path>
            </svg>
        </button>
        <div>
            <svg xmlns="http://www.w3.org/2000/svg" onclick="closeChat();" width="24" height="24"
                viewBox="0 0 24 24">
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" fill="white" />
                <path d="M0 0h24v24H0z" fill="none" />
            </svg>
        </div>

        <div class="bot-image-container">
          <img src="`+base_url_hottrix_custom_hemant+`assets/chatbot.png" style="height: 40px; width: 40px; border-radius: 50%;">
        </div>
        <span style="display: flex; align-items: center; justify-content: center;">HOTBOT<sup>&nbsp;&nbsp;&nbsp;<span
        id="agentStatus"></span></span>
    </div>
    <div class="chat-area" id="message-box"></div>

    <div class="line"></div>
    <div class="input-div" id="input_message_box" style="position:relative">
        <input class="input-message" name="message" type="text" id="message" placeholder="Type your message ..." />
        <button class="input-send" onclick="send()">
            <svg style="width:24px;height:24px">
                <path d="M2,21L23,12L2,3V10L17,12L2,14V21" fill="#00214d"></path>
            </svg>
        </button>
    </div>
</div>
`;


if (document.getElementById('hottrix_chat_widow_initiate_root')) {
  var hottrix_chatbot_root_element = document.getElementById('hottrix_chat_widow_initiate_root');


  function setChatBotVariables(campaign_encCode){
    const xhr = new XMLHttpRequest();
    xhr.open("POST", base_url_hottrix_custom_hemant + "requiredSettingsforhatbot.php", false);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.send("campaign_id=" + campaign_encCode);
    
    if (xhr.status === 200) {
      let response_data = xhr.responseText;
      return response_data;
    } else {
      return false;
    }
  }

  let isChatbot_vriablesSet =setChatBotVariables(encodeURIComponent(hottrix_chatbot_root_element.getAttribute('data-hottrix-secret-key')));
  let hottrix_chat_bot_variable_data =JSON.parse(isChatbot_vriablesSet);

  if(hottrix_chat_bot_variable_data.status){
  
    welcome_message = hottrix_chat_bot_variable_data.data.welcome_message;
    invalid_message = hottrix_chat_bot_variable_data.data.invalid_message;
    countdownTimer  = hottrix_chat_bot_variable_data.data.countTimer;

    url_campaign_data = hottrix_chat_bot_variable_data.data.campaign;
    isChatOn_ = hottrix_chat_bot_variable_data.data.isChatEnabled;

    function addCssLinks() {
      // Create link elements
      var link1 = document.createElement('link');
      link1.rel = 'stylesheet';
      link1.href = 'https://desk.hottrix.in/modules/hotbot_version_two//style.css';

      var link2 = document.createElement('link');
      link2.rel = 'stylesheet';
      link2.href = 'https://desk.hottrix.in/modules/hotbot_version_two//fivestar.css';

      var link3 = document.createElement('link');
      link3.rel = 'stylesheet';
      link3.href = 'https://desk.hottrix.in/modules/hotbot_version_two//wisgetstyle.css';

      // Append links to the head tag
      document.head.appendChild(link1);
      document.head.appendChild(link2);
      document.head.appendChild(link3);
  }

  addCssLinks();
  hottrix_chatbot_root_element.innerHTML = hottrix_chat_interfae_Html;



    let chatbottoggler = document.getElementById('chatbot');
    chatbottoggler.onclick = function() {
      if (localStorage.getItem('customerCount') == 'false') {
      localStorage.setItem('customerCount', true);
      let xhr_count = new XMLHttpRequest;

      // const url = base_url_hottrix_custom_hemant+'increaseCustomerCount.php';
      const url = base_url_hottrix_custom_hemant + 'increaseCustomerCount.php?campaign='+encodeURIComponent(hottrix_chatbot_root_element.getAttribute('data-hottrix-secret-key'));

      fetch(url)
        .then(response => response.json())
        .then(data => console.log(""))
        .catch(error => console.error(error));
      }
    }
    var msgdelay = 1000;

    localStorage.clear();
    localStorage.setItem('ShowWelcomeMsg', true);
    localStorage.setItem('customerCount', false);

    if (localStorage.getItem('is_agent_connected') !== null) {
      const isAgentConnected = localStorage.getItem('is_agent_connected');

      if (isAgentConnected === 'true') { } else {
        document.getElementById('input_message_box').style.display = "none";
      }
    } else {
      localStorage.setItem('is_agent_connected', 'false');
      document.getElementById('input_message_box').style.display = "none";
    }

    let chatCloseIcon = document.getElementById('chatCloseIcon');
    chatCloseIcon.style.display = "none";
    chatCloseIcon.onclick = function () {
      chatCloseIcon.style.display = "none";
    }

    const chat_conn = new WebSocket(hottrix_websocket_service);
    localStorage.clickcount = 0;
    console.log(hottrix_websocket_service);

    chat_conn.onopen = function (e) {
      console.log("chat WebSocket connection established");
    }
    chat_conn.onmessage = function (e) {
      data = JSON.parse(e.data);
      let action_type = data.action_type;
      if (action_type != "CHAT_REQUEST") {
        let connect_id = data.customer_id;
        let response_msg = { 0: data.msg };
        let conversation_id = data.conversation_id;

        let user_conversation_id = localStorage.getItem("user_conversation_id");
        if (action_type == "CHAT_CLOSED" && user_conversation_id == connect_id) {
          document.getElementById("agentStatus").innerHTML =
            '<img src="' + base_url_hottrix_custom_hemant + 'assets/inactive.png" style="width:12px"><small>Chat Closed</small></sup>';
          document.getElementById("input_message_box").style.display = "none";
          resetChatWindow();
          reset_local_chat_info();
        } else if (
          action_type == "CHAT_ACCEPT" &&
          user_conversation_id == connect_id
        ) {
          localStorage.setItem("is_agent_connected", true);
          localStorage.setItem("conversation_id", conversation_id);

          chatbotResponse(response_msg);
          let agentmsg = { 0: data.msg2 };
          chatbotResponse(agentmsg);

          document.getElementById("input_message_box").style.display = "";
          document.getElementById("agentStatus").innerHTML =
            '<img src="' + base_url_hottrix_custom_hemant + 'assets/active.png" style="width:12px"><small>Connected</small></sup>';
          removeTimer();
        } else if (
          action_type == "CHAT_STARTED" &&
          user_conversation_id == connect_id
        ) {
          chatbotResponse(response_msg);
          document.getElementById("agentStatus").innerHTML =
            '<img src="' + base_url_hottrix_custom_hemant + 'assets/active.png" style="width:12px"><small>Connected</small></sup>';
        }
      }
    };

    var running = false;

    function filter_message(msg, callback) {
      const xhr = new XMLHttpRequest();
      xhr.open("POST", base_url_hottrix_custom_hemant + "filter_words.php", true);
      xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            let response_data = xhr.responseText;
            callback(response_data);
          } else {
            console.error("Error:", xhr.status);
          }
        }
      };
      xhr.send("msg=" + msg);
    }

    function send(user_msg = true) {
      var entermsg = document.getElementById("message").value;
      msg = removeSpecialCharacters(entermsg);
      if (msg != "") {
        filter_message(msg, function (filtered_msg) {
          addMsg(filtered_msg);
        });
      }
    }

    function addMsg(msg) {
      var div = document.createElement("div");
      div.innerHTML =
        "<span style='flex-grow:1'></span><div class='chat-message-sent'>" +
        msg +
        "</div>";
      div.className = "chat-message-div";

      document.getElementById("message-box").appendChild(div);
      document.getElementById("message").value = "";
      document.getElementById("message-box").scrollTop =
        document.getElementById("message-box").scrollHeight;

      if (localStorage.getItem("is_agent_connected") == "true") {
        user_id = localStorage.getItem("user_conversation_id");
        conversation_id = localStorage.getItem("conversation_id");

        createChatHistory(conversation_id, msg, user_id);
        addResponseMsg(msg);
      }
    }

    function createChatHistory(conversation_id, message, added_by) {
      data = {
        conversation_id: conversation_id,
        message: message,
        user_id: added_by,
        action_by: "CUSTOMER",
      };

      let request = new XMLHttpRequest();
      request.open("POST", base_url_hottrix_custom_hemant + "capturechathistory.php", true);
      request.setRequestHeader("Content-type", "application/json; charset=UTF-8");
      request.send(JSON.stringify(data));
      request.onload = function () {
        if (request.readyState === 4) {
        }
      };
    }

    function addResponseMsg(msg) {
      conversation_id = localStorage.getItem("conversation_id");
      if (
        conversation_id == null ||
        conversation_id == "undefined" ||
        conversation_id == ""
      ) {
        alert("Something Went Wrong ! Pleaase Restart Chat");
      } else {
        chat_conn.send(
          JSON.stringify({
            customer_id: localStorage.getItem("user_conversation_id"),
            conversationID: conversation_id,
            action_type: "CHAT_STARTED",
            msg: msg,
            action_for: "chat",
          })
        );
        send();
      }
    }
    function closeChat() {
      if (confirm("Are you sure you want to close Session ?")) {
        updateCloseChatStatus();
        localStorage.clear();
        location.reload();
      }
    }
    function updateCloseChatStatus() {
      let conversation_id = localStorage.getItem("conversation_id");
      let user_id = localStorage.getItem("user_conversation_id");

      if (conversation_id && conversation_id != "" && user_id && user_id != "") {
        let url = base_url_hottrix_custom_hemant + "chatCloseByCustomer.php";

        const requestBody = {
          conv_id: conversation_id,
          userid: user_id,
        };

        const headers = {
          "Content-Type": "application/json",
        };

        const fetchOptions = {
          method: "POST",
          headers: headers,
          body: JSON.stringify(requestBody),
        };

        fetch(url, fetchOptions)
          .then((response) => response.json())
          .then((data) => {
            chat_conn.send(
              JSON.stringify({
                customer_id: user_id,
                conversationID: conversation_id,
                action_type: "AGENT_CHAT_CLOSE",
                msg: "User Has Left The Chat",
                action_for: "chat",
              })
            );
          })
          .catch((error) => console.error(error));
      }
    }

    function removeSpecialCharacters(inputString) {
      return inputString.replace(/[^\w\s]/gi, "");
    }

    function chatbotResponse(message) {
      localStorage.setItem("bot_response_for_api", message[0]);
      var div = document.createElement("div");
      div.innerHTML = "<div class='chat-message-received'>" + message[0] + "</div>";

      div.className = "chat-message-div";
      document.getElementById("message-box").appendChild(div);
      document.getElementById("message-box").scrollTop =
        document.getElementById("message-box").scrollHeight;
      running = false;
    }
    function fetchSuggestionResponse(suggestion = null) {
      var entermsg = suggestion;
      msg = removeSpecialCharacters(entermsg);
      if (msg != "") {
        filter_message(msg, function (filtered_msg) {
          addMsg(filtered_msg);
        });
      }
    }

    function ChatFormRequest() {
      const bot_name = document.getElementById("bot_name");
      const bot_mobile = document.getElementById("bot_mobile");
      const bot_email = document.getElementById("bot_email");
      const bot_suggestion = document.getElementById("chat_request_suggestion");

      if (bot_name.value != "" && bot_mobile.value != "" && bot_email.value != "") {
        customer_name = bot_name.value;
        reuest_data = {
          name: bot_name.value,
          mobile: bot_mobile.value,
          email: bot_email.value,
          bot_suggestion: bot_suggestion.value,
        };
        fetch(base_url_hottrix_custom_hemant + "request_chat.php", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(reuest_data),
        })
          .then((response) => response.json())
          .then((data) => {
            localStorage.setItem("user_conversation_id", data.user_id);
            chat_conn.send(
              JSON.stringify({
                customer_id: data.user_id,
                action_type: "CHAT_REQUEST",
                msg: "You have new chat request from " + bot_name.value,
                action_for: "chat",
                suggestion_id: bot_suggestion.value,
              })
            );

            message = "Please wait chat request sent ............";
            let _response = { 0: message };
            document.getElementById("input_message_box").style.display = "none";
            document.getElementById("message-box").innerHTML = "";
            chatbotResponse(_response);
            reverseCountdown(countdownTimer);
          })
          .catch((error) => {
            console.log("Error:", error);
          });
      }
    }

    function BotWelcomeMessage(message) {
      var div = document.createElement("div");
      div.innerHTML = "<div class='chat-message-received'>" + message + "</div>";
      div.className = "chat-message-div";
      document.getElementById("message-box").appendChild(div);
      document.getElementById("message-box").scrollTop =
        document.getElementById("message-box").scrollHeight;
      running = false;
      fetchWelcomeSuggestions();
    }
    function welcome_msg_of_bot(message){
      var div = document.createElement("div");
      div.innerHTML = "<div class='chat-message-received'>" + message + "</div>";
      div.className = "chat-message-div";
      document.getElementById("message-box").appendChild(div);
      document.getElementById("message-box").scrollTop =
        document.getElementById("message-box").scrollHeight;
    }
    function captureBotHistory(message, action_by) {
      var bot_data = {
        query: message,
        action_by: action_by,
        created_at: localStorage.getItem("CURRENT_TIME"),
      };

      fetch("bot_response_history.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bot_data),
      })
        .then((response) => response.json())

        .then((data) => { })

        .catch((error) => {
          console.log("Error:", error);
        });
    }

    function getCurrentDataTime() {
      const currentDate = new Date();
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth() + 1;
      const day = currentDate.getDate();
      const hours = currentDate.getHours();

      const minutes = currentDate.getMinutes();
      const seconds = currentDate.getSeconds();
      const currentDateTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
      localStorage.setItem("CURRENT_TIME", currentDateTime);
    }
    setInterval(() => {
      getCurrentDataTime();
    }, 1000);

    document.getElementById("message").addEventListener("keyup", function (event) {
      if (event.keyCode === 13) {
        event.preventDefault();
        send();
      }
    });

    document.getElementById("chatbot_toggle").onclick = function () {
      if (document.getElementById("chatbot").classList.contains("collapsed")) {
        document.getElementById("chatbot").classList.remove("collapsed");
        document.getElementById("chatbot_toggle").children[0].style.display =
          "none";
        document.getElementById("chatbot_toggle").children[1].style.display = "";

        if (localStorage.getItem("is_agent_connected") == "false") {
          if (localStorage.getItem("ShowWelcomeMsg") === "true") {
            setTimeout(BotWelcomeMessage, 1000, welcome_message);
            localStorage.setItem("ShowWelcomeMsg", false);
          }
        }
      } else {
        document.getElementById("chatbot").classList.add("collapsed");
        document.getElementById("chatbot_toggle").children[0].style.display = "";
        document.getElementById("chatbot_toggle").children[1].style.display =
          "none";
      }
    };

    function OpenAPIform() {
      var existingDiv = document.getElementById("chat_request_request");

      if (existingDiv) {
        existingDiv.parentNode.removeChild(existingDiv);
      }

      var div = document.createElement("div");
      div.innerHTML += "<span>Enter Application Number</span>";
      div.innerHTML += "<div>";
      div.innerHTML +=
        '<div class="form-inputs"><input type="text" class="fagent_request_form effect-7" id="bot_application_check" name="bot_application_check" placeholder="Enter here...."><span class="focus-border"><i></i></span></div>';
      div.innerHTML += "</div>";
      div.innerHTML += "<div>";
      div.innerHTML += "</div>";
      div.innerHTML += "<div>";
      div.innerHTML +=
        '<button type="button" class="hottrix-btn chat-hottrix-btn-nmr" onclick="CheckApplicationStatus();">Check</button>';
      div.innerHTML += "</div>";

      div.setAttribute("id", "chat_request_request");
      div.className = "chat_request_request chat-form";

      div.style.marginLeft = "17px";
      div.style.marginBottom = "8px";
      div.style.marginTop = "8px";
      document.getElementById("message-box").appendChild(div);
      document.getElementById("message-box").scrollTop =
        document.getElementById("message-box").scrollHeight;
    }

    function CheckApplicationStatus() {
      let application_num = document.getElementById("bot_application_check").value;

      if (application_num != "") {
        msg = removeSpecialCharacters(application_num);

        const xhr = new XMLHttpRequest();
        const url = base_url_hottrix_custom_hemant + "demoapi.php";

        xhr.open("POST", url, true);
        xhr.setRequestHeader("Content-Type", "application/json");
        const requestData = {
          application_number: msg,
        };

        const jsonData = JSON.stringify(requestData);
        xhr.onreadystatechange = function () {
          if (xhr.readyState === 4) {
            if (xhr.status === 200) {
              let response_data = xhr.responseText;
              resp = JSON.parse(response_data);
              let api_response = { 0: resp.status };
              chatbotResponse(api_response);
            }
          }
        };

        xhr.send(jsonData);
        document.getElementById("message-box").scrollTop =
          document.getElementById("message-box").scrollHeight;
      }

      document.getElementById("bot_application_check").value = "";
      existingDiv = document.getElementById("chat_request_request");

      if (existingDiv) {
        existingDiv.parentNode.removeChild(existingDiv);
      }
    }

    function fetchWelcomeSuggestions() {
      const xhr = new XMLHttpRequest();
      const url = base_url_hottrix_custom_hemant + "welcome_suggestion.php";

      xhr.open("POST", url, true);
      xhr.setRequestHeader("Content-Type", "application/json");
      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
          let response_data = xhr.responseText;
          if (response_data && response_data.length > 0) {
            let resp = JSON.parse(response_data);
            var div = document.createElement("div");

            for (let i = 0; i < resp.length; i++) {
              var newDiv =
                '<div style="border-radius:0px;cursor:pointer;" onclick="redirectFunctionality(\'' +
                resp[i].functions +
                '\');" class="chat-message-received">' +
                resp[i].first_keyword +
                "</div>";
              div.innerHTML += newDiv;
            }

            div.className = "chat-message-div";
            document.getElementById("message-box").appendChild(div);
            document.getElementById("message-box").scrollTop =
              document.getElementById("message-box").scrollHeight;
          }
          fetchkeywords();
        }
      };
      xhr.send();
    }
    function ChatRequestForm(suggestion_id,parent_suggestion) {
      const headers = {
        "Content-Type": "application/json",
      };
      const fetchOptions = {
        method: "POST",
        headers: headers,
      };
      console.log("here");
      let url = base_url_hottrix_custom_hemant + "checkblockChatDate.php?campaign="+url_campaign_data;
      fetch(url, fetchOptions)
        .then((response) => response.json())
        .then((response) => {
          if (!response) {
            GDPR_Consent_Form(suggestion_id,parent_suggestion);
          } else {
            feedbackStar(suggestion_id);
          }
        })
        .catch((err) => {
          console.error(err);
        });
    }

    function chatFrom(suggestion_id) {
      var existingDiv = document.getElementById("chat_request_request");

      if (existingDiv) {
        existingDiv.parentNode.removeChild(existingDiv);
      }

      var feedContainer = document.querySelector(".feed-container");
      if (feedContainer) {
        feedContainer.style.display = "none";
      }

      var div = document.createElement("div");
      div.innerHTML += "<span>Agent Chat Request Form</span>";
      div.innerHTML += "<div>";
      div.innerHTML +=
        '<input id="chat_request_suggestion" type="hidden" value="' +
        suggestion_id +
        '"><div class="form-inputs"><input type="text" class="agent_request_form effect-7" id="bot_name" name="name" placeholder="Enter your name"><span class="focus-border"><i></i> </span>';
      div.innerHTML += "</div>";
      div.innerHTML += "<div>";
      div.innerHTML +=
        '<div class="form-inputs"><input  type="text" class="fagent_request_form effect-7" id="bot_mobile" name="mobile" placeholder="Enter your mobile"><span class="focus-border"><i></i> </span>';
      div.innerHTML += "</div>";
      div.innerHTML += "<div>";
      div.innerHTML +=
        '<div class="form-inputs"><input  type="email" class="agent_request_form effect-7" id="bot_email" name="email" placeholder="Enter your email"><span class="focus-border"><i></i> </span>';
      div.innerHTML += "</div>";
      div.innerHTML += "<div>";
      div.innerHTML +=
        '<button type="button" class="hottrix-btn chat-hottrix-btn-nmr" onclick="ChatFormRequest();" style="display: inline;">Send</button> <button type="button" class="hottrix-btn chat-hottrix-btn-nmr" onclick="clearBotScreen()" style="display: inline;">New Session</button>';
      div.innerHTML += "</div>";

      div.setAttribute("id", "chat_request_request");

      div.style.marginLeft = "17px";
      div.style.marginBottom = "8px";

      div.className = "chat_request_request chat-form";
      document.getElementById("message-box").appendChild(div);
      document.getElementById("message-box").scrollTop =
        document.getElementById("message-box").scrollHeight;
    }
    function redirectFunctionality(events) {
      if (events == "OpenAPIform") {
        OpenAPIform();
      } else if (events == "ChatRequestForm") {
        // ChatRequestForm();
      }
    }

    var offset = 0;
    var keyword_data;
    var startIndex = 0;
    const increments = 10;
    function fetchkeywords() {
      var element = document.querySelector(".bot-response-message");
      let campaign = url_campaign_data;

      if (element && element.parentNode) {
        element.parentNode.removeChild(element);
      }

      var xhr = new XMLHttpRequest();
      var method = "POST";
      var url = base_url_hottrix_custom_hemant + "fetch_keywords.php";
      var async = true;

      xhr.open(method, url, async);
      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
          keyword_data = JSON.parse(xhr.responseText);
          keywords_accessment();
        }
      };

      var data = "offset=" + encodeURIComponent(offset) + "&campaign=" + encodeURIComponent(campaign);
      xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
      xhr.send(data);
    }
    function keywords_accessment() {
      var element = document.querySelector(".bot-response-message");

      if (element && element.parentNode) {
        element.parentNode.removeChild(element);
      }

      const elementsToShow = keyword_data.slice(startIndex, startIndex + increments);
      var div = document.createElement("div");
      for (let i = 0; i < elementsToShow.length; i++) {
        var newDiv =
          '<div style="border-radius:0px;cursor:pointer;" onclick="capturekeywordHistory(\'' +
          elementsToShow[i].keywords +
          "'," +
          elementsToShow[i].id +
          ");getSuggestions('" +
          elementsToShow[i].id +
          "');addMsg('" +
          elementsToShow[i].keywords +
          '\');" class="chat-message-received keywords-items">' +
          elementsToShow[i].keywords +
          "</div>";
        div.innerHTML += newDiv;
      }
      var buttonDiv = document.createElement("div");
      if (startIndex + increments < keyword_data.length) {
        buttonDiv.style.borderRadius = "0px";
        buttonDiv.style.cursor = "pointer";
        buttonDiv.style.display = "flex";
        buttonDiv.innerHTML +=
          '<button class="chat-hottrix-btn" onclick="fetchNextKeywords(); ">more...</button>';
        div.appendChild(buttonDiv);
      }
      if (startIndex > 0) {
        buttonDiv.style.borderRadius = "0px";
        buttonDiv.style.cursor = "pointer";
        buttonDiv.style.display = "flex";
        buttonDiv.innerHTML +=
          '<button class="chat-hottrix-btn" onclick="fetchPreviousKeywords();">Previous...</button>';
        div.appendChild(buttonDiv);
      }
      // showPreviousBtn.style.display = startIndex > 0 ? 'block' : 'none';
      div.classList.add(
        "chat-message-div",
        "bot-response-message",
        "keyword-container"
      );
      document.getElementById("message-box").appendChild(div);
      document.getElementById("message-box").scrollTop = document.getElementById("message-box").scrollHeight;
    }
    function fetchNextKeywords() {
      startIndex += 2;
      keywords_accessment();;
    }

    function fetchPreviousKeywords() {
      startIndex = Math.max(0, startIndex - 2);
      keywords_accessment();
    }

    function getSuggestions(keywords_id) {
      var element = document.querySelector(".bot-response-message");

      if (element && element.parentNode) {
        element.parentNode.removeChild(element);
      }

      var xhr = new XMLHttpRequest();
      var method = "POST";
      var url = base_url_hottrix_custom_hemant + "fetch_suggestions.php";
      var async = true;

      xhr.open(method, url, async);
      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
          var resp = JSON.parse(xhr.responseText);
          var div = document.createElement("div");

          for (let i = 0; i < resp.results.length; i++) {
            var newDiv =
              '<div style="border-radius:0px;cursor:pointer;" onclick="disappearElement();captureSuggestionHistory(`' +
              resp.results[i].suggestion +
              "`," +
              resp.results[i].id +
              ");getResponse(`" +
              resp.results[i].id +
              "`);addMsg(`" +
              resp.results[i].suggestion +
              '`);" class="captureSuggestionHistory chat-message-received keywords-items">' +
              resp.results[i].suggestion +
              "</div>";
            div.innerHTML += newDiv;
          }
          let backtoButton = '<div style="border-radius:0px;cursor:pointer;" onclick="fetchkeywords(); addMsg(\'Back To Main Menu...\');" class="captureSuggestionHistory chat-message-received keywords-items">Back To Menu</div>';
          div.innerHTML += backtoButton;
          div.classList.add(
            "chat-message-div",
            "bot-response-message",
            "suggestion-div"
          );
          clearPreviousScreen();
          welcome_msg_of_bot(welcome_message);
          document.getElementById("message-box").appendChild(div);
          document.getElementById("message-box").scrollTop =
            document.getElementById("message-box").scrollHeight;
          // backTomainMenuButton();
        }
      };
      var data = "keywords_id=" + encodeURIComponent(keywords_id);
      xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
      xhr.send(data);
    }

    function getResponse(suggestion_id) {
      var element = document.querySelector(".bot-response-message");

      if (element && element.parentNode) {
        element.parentNode.removeChild(element);
      }

      var xhr = new XMLHttpRequest();
      var method = "POST";
      var url = base_url_hottrix_custom_hemant + "fetch_response.php";
      var async = true;
      xhr.open(method, url, async);
      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
          let resp = JSON.parse(xhr.responseText);
          let div = document.createElement("div");

          for (let i = 0; i < resp.results.length; i++) {
            let response="";
            if(resp.results[i].response_text ==""){
              response =welcome_message;
            }else{
              response =resp.results[i].response_text
            }
            let newDiv = '<div style="border-radius:0px;cursor:pointer;"  class="chat-message-received response-container">' +response +'</div>'; 
            div.innerHTML += newDiv;
            getSuggestionChild(suggestion_id,suggestion_id);
            // wasThisHelpful(suggestion_id);
          }

          div.classList.add("chat-message-div", "bot-response-message");
          document.getElementById("message-box").appendChild(div);
          document.getElementById("message-box").scrollTop =
            document.getElementById("message-box").scrollHeight;
        }
      };
      var data = "suggestion_id=" + encodeURIComponent(suggestion_id);
      xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
      xhr.send(data);
    }
    // this function captures which keyword is getting pressed by the users for the report purpose
    function capturekeywordHistory(keywords, keyword_id) {
      var xhr = new XMLHttpRequest();
      var method = "POST";
      var url = base_url_hottrix_custom_hemant + "captureBotKeywords.php";
      var async = true;
      xhr.open(method, url, async);
      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
        }
      };

      var data =
        "keywords_value=" +
        encodeURIComponent(keywords) +
        "&keywords_id=" +
        encodeURIComponent(keyword_id);
      xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
      xhr.send(data);
    }

    // this function captures which suggestions is getting pressed by the users for the report purpose
    function captureSuggestionHistory(suggestion_name, suggestion_id) {
      var xhr = new XMLHttpRequest();
      var method = "POST";
      var url = base_url_hottrix_custom_hemant + "captureBotSuggestions.php";
      var async = true;
      xhr.open(method, url, async);
      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
        }
      };

      // var data =
      //   "suggestion_name=" +
      //   encodeURIComponent(suggestion_name) +
      //   "&suggestion_id=" +
      //   encodeURIComponent(suggestion_id);
      var data =
        "suggestion_name=" +encodeURIComponent(suggestion_name) +
        "&suggestion_id="  +encodeURIComponent(suggestion_id)+ 
        "&campaign_id="    +encodeURIComponent(hottrix_chatbot_root_element.getAttribute('data-hottrix-secret-key'));
      xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
      xhr.send(data);
    }

    function wasThisHelpful(parent_suggestion,suggestion_id = null) {
      setTimeout(function () {
        let rateHTML =
          '<div class="feed-container"><div class="rate feed-wraps" style="letter-spacing: 0.5px;">Was This Article Helpful? <button class="art-btn chat-hottrix-btn" onclick="feedbackStar(' +
          suggestion_id +
          ');">Yes</button> <button class="art-btn2 chat-hottrix-btn" onclick="ChatRequestForm('+suggestion_id+',' +parent_suggestion +');">No</button></div></div>';
        const rateContainer = document.createElement("div");

        rateContainer.innerHTML = rateHTML;
        const messageBoxElement = document.getElementById("message-box");

        messageBoxElement.appendChild(rateContainer);
        document.getElementById("message-box").scrollTop =
          document.getElementById("message-box").scrollHeight;
      }, 500);
    }

    function feedbackStar(data = null) {
      // setTimeout(function () {
      var feedContainer = document.querySelector(".feed-container");
      if (feedContainer) {
        feedContainer.style.display = "none";
      }

      let rateHTML =
        '<div id="feedback-starr" style="display:flex;justify-content:center"><div class="rate">' +
        '<input onclick="savefeedbackData(' +
        data +
        ',1,\'bot\')" type="radio" id="star5" name="rate" value="5" />' +
        '<label for="star1" title="text">5 stars</label>' +
        '<input onclick="savefeedbackData(' +
        data +
        ',2,\'bot\')" type="radio" id="star4" name="rate" value="4" />' +
        '<label for="star2" title="text">4 stars</label>' +
        '<input onclick="savefeedbackData(' +
        data +
        ',3,\'bot\')" type="radio" id="star3" name="rate" value="3" />' +
        '<label for="star3" title="text">3 stars</label>' +
        '<input onclick="savefeedbackData(' +
        data +
        ',4,\'bot\')" type="radio" id="star2" name="rate" value="2" />' +
        '<label for="star4" title="text">2 stars</label>' +
        '<input onclick="savefeedbackData(' +
        data +
        ',5,\'bot\')" type="radio" id="star1" name="rate" value="1" />' +
        '<label for="star5" title="text">1 star</label>' +
        "</div></div>";

      const rateContainer = document.createElement("div");
      rateContainer.innerHTML = rateHTML;
      rateContainer.style.display="flex";
      rateContainer.style.justifyContent="center";

      const messageBoxElement = document.getElementById("message-box");

      messageBoxElement.appendChild(rateContainer);
      document.getElementById("message-box").scrollTop =
        document.getElementById("message-box").scrollHeight;
      // }, msgdelay);
    }

    // functions for chatbubbles starts here
    function appendChatBubble() {
      const chatBubble = document.createElement("div");
      chatBubble.className = "chat-bubble";

      const typingContainer = document.createElement("div");
      typingContainer.className = "typing";

      for (let i = 0; i < 3; i++) {
        const dot = document.createElement("div");
        dot.className = "dot";
        typingContainer.appendChild(dot);
      }

      chatBubble.appendChild(typingContainer);
      document.getElementById("message-box").appendChild(chatBubble);
    }

    function removeChatBubble() {
      const chatBubble = document.querySelector(".chat-bubble");
      if (chatBubble) {
        chatBubble.remove();
      }
    }

    function savefeedbackData(suggestion, rating, feedback_for) {
      var xhr = new XMLHttpRequest();
      var method = "POST";
      // var url = base_url_hottrix_custom_hemant + "feedbackajax.php";
      var url = base_url_hottrix_custom_hemant + "feedbackajax.php?campaign="+encodeURIComponent(hottrix_chatbot_root_element.getAttribute('data-hottrix-secret-key'));
      
      var async = true;

      xhr.open(method, url, async);
      xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
          if (xhr.responseText != false) {
            let element = document.getElementById("feedback-starr");
            element.style.color = "black";
            element.style.marginTop = "20px";
            element.innerHTML = "Thank You for Your Feedback!";
            resetChatWindow();
          }
        }
      };

      var data = "suggestion_id=" + encodeURIComponent(suggestion);
      data += "&rating=" + encodeURIComponent(rating);
      data += "&feedback_for=" + encodeURIComponent(feedback_for);
      xhr.send(data);
    }

    function resetChatWindow() {
      let rateHTML =
        '<div id="reset-bot-window" style="display:flex;justify-content:center;align-items:center;margin-top:10px;"><button onclick=clearBotScreen(); class="bot-window-reset-window chat-hottrix-btn-nmr">Start New Session</button</div>';
      offset = 0;

      const rateContainer = document.createElement("div");
      rateContainer.innerHTML = rateHTML;
      const messageBoxElement = document.getElementById("message-box");
      rateContainer.style.display="flex";
      rateContainer.style.justifyContent="center";
      messageBoxElement.appendChild(rateContainer);
      document.getElementById("message-box").scrollTop =
        document.getElementById("message-box").scrollHeight;
    }


    function reset_local_chat_info() {
      localStorage.setItem("is_agent_connected", "false");
      localStorage.removeItem("conversation_id");
      localStorage.removeItem("user_conversation_id");
    }

    function clearBotScreen() {
      document.getElementById("message-box").innerHTML = "";
      document.getElementById("agentStatus").innerHTML = "";
      setTimeout(BotWelcomeMessage, 1000, welcome_message);
    }

    function backTomainMenuButton() {
      let rateHTML = '<div id="backTomainMenuButton" style="display:flex;align-items:center;margin-top:10px;"><button class="chat-hottrix-btn" onclick="fetchkeywords(); addMsg(\'Back To Main Menu...\');disappearElement()" class="btn-design">Back To Main Menu</button</div>';
      const rateContainer = document.createElement("div");
      rateContainer.innerHTML = rateHTML;
      const messageBoxElement = document.getElementById("message-box");
      messageBoxElement.appendChild(rateContainer);
      document.getElementById("message-box").scrollTop = document.getElementById("message-box").scrollHeight;
    }

    function disappearElement() {
      let element = document.getElementById("backTomainMenuButton");
      if (element) {
        element.style.display = "none";
      }
    }

    function is_agent_connected() {
      let agentStatus = localStorage.getItem("is_agent_connected");
      if (agentStatus && agentStatus == "true") {
        let convrsation_id = localStorage.getItem("conversation_id");
        let userId = localStorage.getItem("user_conversation_id");

        if (convrsation_id && convrsation_id !== "" && userId && userId !== "") {
          fetch(base_url_hottrix_custom_hemant + "checkagentStatus.php", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              added_by: userId,
              convId: convrsation_id,
            }),
          })
            .then((response) => {
              if (!response.ok) {
                throw new Error("Network response was not ok");
              }
              return response.json();
            })
            .then((data) => {
              if (data.status) {
                document.getElementById("agentStatus").innerHTML = data.message;
              }
            })
            .catch((error) => {
              console.error("Error:", error);
            });
        }
      }
    }

    function addBeforeUnloadEvent() {
      window.addEventListener("beforeunload", function (e) {
        const confirmationMessage =
          "You have unsaved changes. Do you really want to leave the page?";
        e.returnValue = confirmationMessage;
      });
    }

    function checkLocalStorage() {
      if (localStorage.getItem("is_agent_connected") === "true") {
        addBeforeUnloadEvent();
        clearInterval(intervalID);
      }
    }

    var countdownInterval;
    var countdownInterval2;
    function waitTimer() {
      countdownInterval2 = setInterval(function () {
        countdownbtn = document.getElementById("countdown");
        if (countdownbtn) {
          countdownbtn.innerHTML =
            "Waiting Time :" + localStorage.getItem("countdown");
        } else {
          let rateHTML =
            '<div id="wrapper-countdown"  style="display:flex;justify-content:center;align-items:center;margin-top:10px;"><button id="countdown"" class="bot-window-reset-window chat-hottrix-btn-nmr">Waiting Time :00:00:00</button</div>';
          offset = 0;

          const rateContainer = document.createElement("div");
          rateContainer.innerHTML = rateHTML;

          const messageBoxElement = document.getElementById("message-box");
          messageBoxElement.appendChild(rateContainer);
          document.getElementById("message-box").scrollTop =
            document.getElementById("message-box").scrollHeight;
          countdownbtn.innerHTML =
            "Waiting Time :" + localStorage.getItem("countdown");
        }
      }, 1000);
    }

    function reverseCountdown(seconds) {
      let count = seconds;

      countdownInterval = setInterval(function () {
        if (count === 0) {
          clearInterval(countdownInterval);
          clearInterval(countdownInterval2);
          let element = document.getElementById("wrapper-countdown");
          if (element) {
            element.style.display = "none";
            localStorage.removeItem("countdown");
            message = "All our agents are busy at this moment";
            let _response = { 0: message };
            chatbotResponse(_response);
            resetChatWindow();
          }
        } else {
          const hours = Math.floor(count / 3600);
          const minutes = Math.floor((count % 3600) / 60);
          const remainingSeconds = count % 60;
          const formattedTime = `${String(hours).padStart(2, "0")}:${String(
            minutes
          ).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`;
          localStorage.setItem("countdown", formattedTime);
          count--;
        }
      }, 1000);
      waitTimer();
    }

    function removeTimer() {
      let element = document.getElementById("wrapper-countdown");
      if (element) {
        clearInterval(countdownInterval);
        clearInterval(countdownInterval2);
        element.style.display = "none";
        localStorage.removeItem("countdown");
      }
    }

    setInterval(is_agent_connected, 9000);
    const intervalID = setInterval(checkLocalStorage, 1000);

    function GDPR_Consent_Form(suggestion_id,parent_Suggestion) {
      let container = document.getElementById('agreement_form_container');
      if (container) {
        if (container.style.display == 'none') {
          container.style.display = 'block';
        }
      } else {
        let div = document.createElement('div');
        div.innerHTML = "<p class='gdpr-consent-form-content'>Under specific circumstances your personal data may be transfer to another country while you are calling using adequate data protection this call may be also recorded for quality and training purposes you have your right to access rectify oppose for legitimate reasons to all your personal data process by BLS International and you can exercise the same by sending an email to Dpo@blsinternational.net, if you disagree please visit India.blsspainvisa.com to know more about our privacy policy if you happy to proceed please click yes to continue or no to cancel the request .</p>";
        div.innerHTML += "<div id='agreement_button_wrapper'><span><button class='agreement_button_yes' onclick='handle_agentForm_and_GDPR_Consent_Form(" + parent_Suggestion + ",`yes`)'>Yes</button></span><span><button class='agreement_button_no' onclick='handle_agentForm_and_GDPR_Consent_Form(" + suggestion_id + ",`no`)'>No</button></span></div>";

        div.classList.add('gdpr-consent-form');
        div.setAttribute("id", "agreement_form_container");
        document.getElementById('message-box').style.position = "relative";
        document.getElementById('message-box').style.borderRadius = '0px';
        document.getElementById('message-box').appendChild(div);
      }

    }

    function GDPR_Consent_Form_hide(){
      let container =document.getElementById('agreement_form_container');
      if(container){
        container.parentNode.removeChild(container);
      }
    
    }

    function handle_agentForm_and_GDPR_Consent_Form(suggestion_id,confirm){
      GDPR_Consent_Form_hide();
      if(confirm=='yes'){
        chatFrom(suggestion_id);
      }else{
        feedbackStar(suggestion_id);
      }
    }

    // code for suggestion Chield START here ===============
    function getSuggestionChild(suggestion_id,parentSuggestion){

      var xhr = new XMLHttpRequest();
      var method = "POST";
      var url = base_url_hottrix_custom_hemant + "suggestion_sub_child.php";
      var async = true;

      xhr.open(method, url, async);
      xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
          if (xhr.responseText == false || xhr.responseText =='flase') {
            
          }else{
            let parsedJson = JSON.parse(this.responseText);
            if(parsedJson.status){
              clearPreviousScreen();
              let isResponsePrinted = createChatBotResponse(parsedJson.parent_id,parsedJson.parent_response,parentSuggestion);
              if(isResponsePrinted){
                if(parsedJson.data){
                  let div = document.createElement('div');
                  for(let i=0;i<parsedJson.data.length;i++){
                    let newDiv ='<div style="border-radius:0px;cursor:pointer;" onclick="disappearElement();captureSuggestionHistory(\'' +parsedJson.data[i].suggestion +"'," +parsedJson.data[i].id +");getSuggestionChild('" +parsedJson.data[i].id +"','" +parentSuggestion +"');addMsg('" +parsedJson.data[i].suggestion +'\');" class="captureSuggestionHistory chat-message-received keywords-items">' + parsedJson.data[i].suggestion +"</div>";
                    div.innerHTML += newDiv;
                  }
                  let newDiv ='<div onclick="goBackToParent('+parsedJson.data[0].parent_id+','+parentSuggestion+')" style="border-radius:0px;cursor:pointer;" class="captureSuggestionHistory chat-message-received keywords-items"><span  style="content:`\\21D0`;">&#8656;</span> Back</div>';
                    div.innerHTML += newDiv;
                  div.classList.add(
                    "chat-message-div",
                    "bot-response-message",
                    "suggestion-div"
                  );
                   
                  document.getElementById("message-box").appendChild(div);
                  document.getElementById("message-box").scrollTop = document.getElementById("message-box").scrollHeight;
                }
              }
            }else{
              createChatBotResponse(parsedJson.parent_id,parsedJson.parent_response,parentSuggestion,true);
            }
          }
        }
      };
      var data = "suggestion_id=" + encodeURIComponent(suggestion_id);
      xhr.send(data);
    }
     function goBackToParent(suggestion_id,parent_Suggestion){
      if(suggestion_id==null || suggestion_id==""){
        clearBotScreen();
      }else{
        var xhr = new XMLHttpRequest();
        var method = "POST";
        var url = base_url_hottrix_custom_hemant + "goBackToParent.php";
        var async = true;

        xhr.open(method, url, async);
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

        xhr.onreadystatechange = function () {
          if (xhr.readyState === 4 && xhr.status === 200) {
            if (xhr.responseText != false) {
              let parsedJson = JSON.parse(this.responseText);
              if(parsedJson.status){
                if(parsedJson.parent_id==null){
                  if(parsedJson.keyword_id){
                    document.getElementById('message-box').innerHTML="";
                    getSuggestions(parsedJson.keyword_id);
                  }
                }else{
                  
                  // if(isResponsePrinted){
                    if(parsedJson.data){
                      clearPreviousScreen();
                      let respWrapper = document.createElement("div");

                      let responseDiv ='<div style="border-radius:0px;cursor:pointer;"  class="chat-message-received response-container chat-message-div bot-response-message">' +parsedJson.parent_response +"</div>";
                      respWrapper.innerHTML += responseDiv;

                      respWrapper.classList.add("chat-message-div", "bot-response-message");
                      document.getElementById("message-box").appendChild(respWrapper);
                      document.getElementById("message-box").scrollTop = document.getElementById("message-box").scrollHeight;
                      let div=document.createElement('div');
                      for(let i=0;i<parsedJson.data.length;i++){
                        let newDiv ='<div style="border-radius:0px;cursor:pointer;" onclick="disappearElement();captureSuggestionHistory(\'' +parsedJson.data[i].suggestion +"'," +parsedJson.data[i].id +");getSuggestionChild('" +parsedJson.data[i].id +"');addMsg('" +parsedJson.data[i].suggestion +'\');" class="captureSuggestionHistory chat-message-received keywords-items">' + parsedJson.data[i].suggestion +"</div>";
                        div.innerHTML += newDiv;
                      }
                      let newDiv ='<div onclick="goBackToParent('+parsedJson.data[0].parent_id+','+parent_Suggestion+')" style="border-radius:0px;cursor:pointer;" class="captureSuggestionHistory chat-message-received keywords-items"><span  style="content:`\\21D0`;">&#8656;</span> Back</div>';
                        div.innerHTML += newDiv;
                      div.classList.add(
                        "chat-message-div",
                        "bot-response-message",
                        "suggestion-div"
                      );
                      
                      if(parsedJson.data[0].parent_id==null || parsedJson.data[0].parent_id==""){
                        welcome_msg_of_bot(welcome_message);
                      }
                      document.getElementById("message-box").appendChild(div);
                      document.getElementById("message-box").scrollTop = document.getElementById("message-box").scrollHeight;
                    }
                  // }
                }
              }else{
                createChatBotResponse(parsedJson.parent_id,parsedJson.parent_response,parent_Suggestion,true);
              }
            }
          }
        };
        var data = "suggestion_id=" + encodeURIComponent(suggestion_id);
        xhr.send(data);
      }
     }
    function createChatBotResponse(suggestion_id,message,parent_suggestion,flag=false) {
      let respmsg="";
      if(clearPreviousScreen()){
        if(message==""){
          respmsg =welcome_message;
        }else{
          respmsg=message;
        }
        let div = document.createElement("div");
        let newDiv ='<div style="border-radius:0px;cursor:pointer;"  class="chat-message-received response-container">'+respmsg+'</div>';
        div.innerHTML += newDiv;

        div.classList.add("chat-message-div", "bot-response-message");
        document.getElementById("message-box").appendChild(div);
        document.getElementById("message-box").scrollTop = document.getElementById("message-box").scrollHeight;

        if(flag){
          wasThisHelpful(parent_suggestion,suggestion_id);
        }
        return true;
      }
    }
    function clearPreviousScreen(){
       if(document.getElementById('message-box')){
          document.getElementById('message-box').innerHTML='';
          return true;
       }
    }
    // Code for Suggestion Chield ends here ===============
  } else {
    console.error("Chatbot Key is not Correct");
  }
} else {
  console.error("failed To initiate Chat Window");
}

