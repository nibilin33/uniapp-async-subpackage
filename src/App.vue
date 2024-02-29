<script>
export default {
  mpType: "app",
  onLaunch() {
    console.log("App Launch");
  },
  onShow() {
    console.log("App Show");
  },
  onHide() {
    console.log("App Hide");
    /* #ifdef H5 */
    fetch("http://127.0.0.1:3000/coverage/client", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(window.__coverage__),
      dataType: "json",
    }).then((res) => {
      return res.json();
    });
    /* #endif */
  },
};
</script>

<style>
/*每个页面公共css */
</style>
