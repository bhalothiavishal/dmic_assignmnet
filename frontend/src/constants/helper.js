import axios from 'axios';
import Swal from "sweetalert2";
var Token_fixed = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MTVlZTliNTA0OTY1ZjQwZWNmN2VkYTMiLCJ1c2VyX3R5cGUiOiJhZG1pbiIsInVzZXJuYW1lIjoiYWRtaW4iLCJpYXQiOjE2NTkyNTM4MzMsImV4cCI6MTY1OTU1NjIzMywiYXVkIjoiRG1pbmMuY29tIiwiaXNzIjoiRG1pbmMiLCJzdWIiOiJEbWluYyJ9.ZejMCxCydgIBRMd86CWyrQXOcM-lLib7Z5ZoB7LXW9wEs2U2vPI6iGZQ5-Sy3fQVnRzsLXTk-jyOULj79fghKw";
var helper = {
  post: async (jsonObj = {}, path = "", token) => {

    const url = process.env.REACT_APP_API_BASE_URL + path;
    const res = await fetch(url, {
      method: "POST",
      body: JSON.stringify(jsonObj),
      headers: {
        "Content-Type": "application/json",
        "x-access-token": Token_fixed 
      }
    });
    return { response: await res, status: await res.status };
  },

  get: async (path = "", token) => {
    const url = process.env.REACT_APP_API_BASE_URL + path;
    const res = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json", "x-access-token": Token_fixed
      }
    });   
    if (res.status === 401) {
      localStorage.removeItem("ons-app");
      localStorage.removeItem("IsLogin");
      localStorage.removeItem("username");
      window.location = '/login';
    }
    return { response: await res, status: await res.status };
  },

  put: async (jsonObj = {}, path = "", token) => {

    const url = process.env.REACT_APP_API_BASE_URL + path;
    const res = await fetch(url, {
      method: "PUT",
      body: JSON.stringify(jsonObj),
      headers: {
        "Content-Type": "application/json", "x-access-token": Token_fixed || ''
      }
    });
    return { response: await res, status: await res.status };
  },
  delete: async (path = "", token) => {

    const url = process.env.REACT_APP_API_BASE_URL + path;
    const res = await fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json", "x-access-token": Token_fixed || ''
      }
    });
    return { response: await res, status: await res.status };
  },
  axios_get: async (jsonObj = {}, path = "", session = {}) => {
    let query = await helper.serialize(jsonObj);
    const url = process.env.REACT_APP_API_BASE_URL + path + "?" + query;
    const res = await axios(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json", "x-access-token": session.token || ''
      }
    });
    if (res.status === 401) {
      localStorage.removeItem("honeywell-app");
      window.location = '/login';
    }
    return res;
  },
  serialize: function (obj, prefix) {
    var str = [],
      p;
    for (p in obj) {
      if (obj.hasOwnProperty(p)) {
        var k = prefix ? prefix + "[" + p + "]" : p,
          v = obj[p];
        str.push((v !== null && typeof v === "object") ?
          this.serialize(v, k) :
          encodeURIComponent(k) + "=" + encodeURIComponent(v));
      }
    }
    return str.join("&");
  },
  getip: async (path = "") => {
    const url = path;
    const res = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      }
    });
    return { response: await res, status: await res.status };
  },
  getIPAddress: async () => {
    const fr = await fetch('https://api.ipify.org/?format=json');
    const res = await fr.json();
    if (fr.status === 200) {
      return res.ip;
    } else {
      return null;
    }
  },
  formPost: async (jsonObj = {}, path = "", token) => {

    const url = process.env.REACT_APP_API_BASE_URL + path;
    const res = await fetch(url, {
      method: "POST",
      body: jsonObj,
      headers: {
        "x-access-token": token || ''
      }
    });
    return { response: await res, status: await res.status };
  },
  SwalConfig: (message = "You want Change Status") => {
    return {
      title: 'Are you sure?',
      text: message,
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
      reverseButtons: true
    }
  }
}

export default helper;


