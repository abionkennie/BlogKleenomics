/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

// Wait for the deviceready event before using any of Cordova's device APIs.
// See https://cordova.apache.org/docs/en/latest/cordova/events/events.html#deviceready
// $(document).ready(function () {
var rootUrl = 'https://kehinde-abiona.000webhostapp.com';
/**
 * wordpress url to retrieve all posts from our blog
 */
const url = `${rootUrl}/wp-json/wp/v2/posts`;
/**
 * wordpress url used to retrieve a token for authentication
 */
var tokenUrl = `${rootUrl}/wp-json/jwt-auth/v1/token`;
/**
 * in this custom scenario, we will be creating posts via admin
 * access however in complex cases you should be able to register
 * new users, the admin username and password is needed to retrieve
 * a token which will be attached
 * as headers to subsequent requests for authentication
 */
var adminDet = {
        "username": "kenny",
        "password": "ayomideololufe"
    }
    /**
     * variable to store token retrieved from the api
     */
var token;
loadData();
fetchToken();

function fetchToken() {
    $.ajax({
        url: tokenUrl,
        type: "post",
        dataType: "json",
        data: adminDet,
        success: function(data) {
            token = data.token;
        },
        error: function(error) {
            console.log(error);
        }
    });
}

function loadData() {
    $.getJSON(url, function(data) {

        /**
         * removes the spinner once a response is gotten from the api
         */
        $("#spinner").remove();
        /**
         * ensures that the div tag with id= mainDiv
         * is empty before appending innerHtml to it
         */
        $(".posts-container").empty();
        /**reiterates through each list in the json object
         * while appending it to the div tag with id= mainDiv
         */
        for (var i = 0; i < data.length; i++) {
            var div = document.createElement('div');
            div.innerHTML = `
            <div class="post">
                <img src="images/pics2.jpg" alt="" class="image">
                <div class="date">
                    <i class="far fa-clock"></i>
                    <span>  ${data[i].date} </span>
                </div>
                <h3 class="title">${data[i].title.rendered}</h3>
                <p class='text'>${data[i].content.rendered}</p>
                <div class="links">
                    <a href="#" class="user">
                        <i class="far fa-user"></i>
                        <span id="span_user_` + data[i].id + `">` + fetchUser(data[i]._links.author[0].href, "#span_user_" + data[i].id) + `</span>
                    </a>
                    <a href="#" class="icon">
                        <i class="far fa-comment"></i>
                        <span>(45)</span>
                    </a>
                    <a href="#" class="icon">
                        <i class="far fa-share-square"></i>
                        <span>(29)</span>
                    </a>
                </div>
            </div>
                `;
            $(".posts-container").append(div);
        };
    });
}

function fetchUser(linkToUserDetails, elemToUpdate) {
    $.ajax({
        url: linkToUserDetails,
        type: "get",
        dataType: "json",
        success: function(data) {
            $(elemToUpdate).text("by " + data.name)
        },
        error: function(error) {
            console.log(error);
        }
    });
}


$(document).on('click', '#create-blog-btn', function(event) {
    // stop the form from submitting the normal way and refreshing the page
    event.preventDefault();

    var formData = {
        title: $('input[name=title]').val(),
        content: $('textarea[name=content]').val(),
        status: 'publish'
    };
    console.log(formData);
    $.ajax({
        url: url,
        type: 'POST',
        dataType: "json",
        data: formData,
        crossDomain: true,
        headers: {
            'Authorization': 'Bearer ' + token
        },
        success: function(data) {
            console.log(data);
            $('input[name=title]').val(""),
                $('textarea[name=content]').val(""),
                alert("upload successful"),
                loadData();
        },
        error: function(error) {
            console.log(error);

        }
    });
});

var newPosts = document.getElementById('getNewPosts')
var loadContainer = document.getElementById('load-container')

newPosts.addEventListener('click', function() {
    var ourRequest = new XMLHttpRequest();
    ourRequest.open('GET', 'https://kehinde-abiona.000webhostapp.com/wp-json/wp/v2/posts')
    ourRequest.onload = function() {
        if (ourRequest.status >= 200 && ourRequest.status < 400) {
            var data = JSON.parse(ourRequest.response);

            createHTML(data);
        } else {
            console.log("No New Post")
        }
    }
    ourRequest.onerror = function() {
        console.log('Connection Error')
    }

    ourRequest.send();

});

function createHTML(postData) {

    var postHTML = ""
    for (var i = 0; i < postData.length; i++) {
        // console.log(postData[i].title.rendered)
        postHTML = '<h2>' + postData[i].title.rendered + '</h2>';
        postHTML = postData[i].content.rendered
    }

    loadContainer.innerHTML = postHTML;
}