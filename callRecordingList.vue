<template>
  <div>
    <dynamicForm
      :dataSource="searchdataSource"
      :isExportText="isExportText"
      @exportOk="exportOk"
      @change="searchChange"
    ></dynamicForm>
    <a-row class="table-title mt24" type="flex" justify="space-between">
      <h3>通话信息列表</h3>
      <a-col>
        <a-button type="primary" v-if="isExport" @click="callRecordExport">
          导出</a-button
        >
      </a-col>
    </a-row>
    <!--设备表格-->
    <a-card :bordered="false" class="mt24">
      <div>
        <a-table
          bordered
          :columns="columns"
          :data-source="tabDataList.res"
          :row-key="(record) => record._id"
          :scroll="scroll"
          :pagination="pagination"
          :loading="loading"
          @change="handleTableChange"
        >
          <template slot="device_no" slot-scope="text">
            <span>{{ text || "-" }}</span>
          </template>
          <template slot="imei" slot-scope="text">
            <span>{{ text || "-" }}</span>
          </template>
          <template slot="username" slot-scope="text">
            <span>{{ text || "-" }}</span>
          </template>
          <template slot="department" slot-scope="text">
            <span>{{ departmentMap[text] || "-" }}</span>
          </template>
          <template slot="send_mobile" slot-scope="text">
            <span>{{ text || "-" }}</span>
          </template>
          <template slot="calling_mobile" slot-scope="text">
            <span>{{ text || "-" }}</span>
          </template>
          <template slot="type" slot-scope="text">
            <span>{{ text == 1 ? "主叫" : text == 2 ? "被叫" : "-" }}</span>
          </template>
          <template slot="start_time" slot-scope="text">
            <span v-if="text">{{
              text | parseTime("{y}-{m}-{d} {h}:{i}:{s}")
            }}</span>
            <span v-else>-</span>
          </template>
          <template slot="end_time" slot-scope="text">
            <span v-if="text">{{
              text | parseTime("{y}-{m}-{d} {h}:{i}:{s}")
            }}</span>
            <span v-else>-</span>
          </template>
          <template slot="spent_time" slot-scope="text">
            <span>{{ text || "-" }}</span>
          </template>
          <template slot="operation" slot-scope="text">
            <a-button
              type="link"
              v-btn="that"
              v-if="isRecording"
              @click="recordingDetails(text)"
              >录音详情</a-button
            >
          </template>
        </a-table>
      </div>
    </a-card>
    <a-modal
      v-model="visible"
      title="录音详情"
      :footer="null"
      class="call-detail-modal"
    >
      <a-row>
        <a-col span="6">IMEI:</a-col>
        <a-col span="18">{{ modalData.imei }}</a-col>
      </a-row>
      <a-row>
        <a-col span="6">员工:</a-col>
        <a-col span="18">{{ modalData.username }}</a-col>
      </a-row>
      <a-row>
        <a-col span="6">呼叫类型:</a-col>
        <a-col span="18">{{
          modalData.type == 1 ? "主叫" : modalData.type == 2 ? "被叫" : "-"
        }}</a-col>
      </a-row>
      <a-row>
        <a-col span="6">对方手机号:</a-col>
        <a-col span="18">{{ modalData.calling_mobile }}</a-col>
      </a-row>
      <a-row>
        <a-col span="6">呼叫时间:</a-col>
        <a-col span="18">{{
          modalData.start_time | parseTime("{y}-{m}-{d} {h}:{i}")
        }}</a-col></a-row
      >
      <a-row
        ><a-col span="6">呼叫时长:</a-col
        ><a-col span="18"
          >{{ modalData.spent_time + "s" || "-" }}
          <div style="float: right">
            <a-button
              v-if="modalData.trans_status == 0"
              type="primary"
              @click="transRecord(modalData)"
              >转文本</a-button
            >
            <span v-if="modalData.trans_status == 1">转码中</span>
            <span v-if="modalData.trans_status == 2">已转码</span>
            <a-button
              v-if="modalData.trans_status == 3"
              type="primary"
              @click="transRecord(modalData)"
              >转码失败，重试？</a-button
            >
          </div>
        </a-col></a-row
      >
      <a-row class="flex-between"
        ><a-col span="24" class="justify-content">
          <video
            controls
            v-if="modalData.vtt != undefined"
            ref="video_play"
            :key="modalData._id"
            :src="modalData.url"
            class="with-caption"
          >
            <track
              label="汉语"
              kind="captions"
              srclang="zh-cn"
              :src="modalData.vtt"
              default
            />
            <p>
              您的浏览器不支持在线播放，请<a
                :href="modalData.url"
                target="_blank"
                >下载</a
              >以后再播放。
            </p>
          </video>
          <audio
            ref="audio_play"
            controls
            v-else
            :key="modalData._id"
            :src="modalData.url"
          >
            <p>
              您的浏览器不支持在线播放，请<a
                :href="modalData.url"
                target="_blank"
                >下载</a
              >以后再播放。
            </p>
          </audio>
        </a-col></a-row
      >
    </a-modal>
  </div>
</template>

<script>
//import BenzAMRRecorder from "benz-amr-recorder";
import { mapState, mapGetters, mapActions, mapMutations } from "vuex";
import dynamicForm from "@/components/from/dynamicForm";
import moment from "moment";

export default {
  name: "callRecordingList",
  components: { dynamicForm },
  data() {
    return {
      searchdataSource: [
        {
          type: "text",
          labelText: "IMEI",
          fieldName: "imei",
          placeholder: "请输入IMEI",
        },
        {
          labelText: "呼叫类型",
          type: "select",
          fieldName: "type",
          defaultValue: "0",
          options: [
            {
              label: "全部",
              value: "0",
            },
            {
              label: "主叫",
              value: "1",
            },
            {
              label: "被叫",
              value: "2",
            },
          ],
        },
        {
          type: "text",
          labelText: "对方手机号",
          fieldName: "calling_mobile",
          placeholder: "请输入被叫手机号",
        },
        {
          type: "text",
          labelText: "姓名",
          fieldName: "username",
          placeholder: "请输入姓名",
        },
        {
          labelText: "部门",
          type: "tree",
          fieldName: "dept_id",
          placeholder: "请选择部门",
          defaultValue: "",
          options: [],
        },
        {
          labelText: "时间",
          type: "datetimeRange",
          fieldName: "dateRange",
          defaultValue: [
            moment("00:00:00", "HH:mm:ss"),
            moment("23:59:59", "HH:mm:ss"),
          ],
          placeholder: ["开始日期", "选择日期"],
        },
      ],
      columns: [
        {
          title: "设备编号",
          key: "device_no",
          dataIndex: "device_no",
          width: 100,
          className: "text-center",
          fixed: "left",
          ellipsis: true,
          scopedSlots: { customRender: "device_no" },
        },
        {
          title: "IMEI",
          key: "imei",
          dataIndex: "imei",
          width: 160,
          className: "text-center",
          fixed: "left",
          // ellipsis: true,
          scopedSlots: { customRender: "imei" },
        },
        {
          title: "员工",
          key: "username",
          dataIndex: "username",
          className: "text-center",
          scopedSlots: { customRender: "username" },
        },
        {
          title: "部门",
          key: "dept_id",
          dataIndex: "dept_id",
          className: "text-center",
          scopedSlots: { customRender: "department" },
        },
        {
          title: "对方手机号",
          width: 140,
          key: "calling_mobile",
          dataIndex: "calling_mobile",
          className: "text-center",
          scopedSlots: { customRender: "calling_mobile" },
        },
        {
          title: "呼叫类型",
          width: 120,
          key: "type",
          dataIndex: "type",
          className: "text-center",
          scopedSlots: { customRender: "type" },
        },
        {
          title: "开始时间",
          width: 180,
          key: "start_time",
          dataIndex: "start_time",
          className: "text-center",
          scopedSlots: { customRender: "start_time" },
        },
        {
          title: "结束时间",
          width: 180,
          key: "end_time",
          dataIndex: "end_time",
          className: "text-center",
          scopedSlots: { customRender: "end_time" },
        },
        {
          title: "时长",
          width: 80,
          key: "spent_time",
          dataIndex: "spent_time",
          className: "text-center",
          scopedSlots: { customRender: "spent_time" },
        },
        {
          title: "操作",
          width: 100,
          className: "text-center",
          scopedSlots: { customRender: "operation" },
          fixed: "right",
        },
      ],
      scroll: { x: 1400, y: 345 },
      tabDataList: {},
      loading: false,
      pagination: {
        total: 0,
        current: 1,
        pageSize: 10, //每页中显示10条数据
        showSizeChanger: true,
        showQuickJumper: false,
        pageSizeOptions: ["10", "20", "50", "100"], //每页中显示的数据
        showTotal: (total) => `共有 ${total} 条数据`, //分页中显示总的数据
      },
      that: this,
      isExport: true,
      playRec: null,
      voiceActive: null,
      visible: false,
      modalData: {},
      timer: null,
      isExportText: "",
      isRecording: true,
      searchParams: {},
    };
  },
  watch: {
    visible(nv) {
      if (!nv) {
        try {
          let player = this.$refs.video_play || this.$refs.audio_play;
          player.pause();
          player.currentTime = 0;
        } catch (e) {
          console.log(e);
        }
      }
    },
  },
  computed: {
    ...mapState("department", ["departmentArr", "departmentMap"]),
    ...mapState("account", ["btnData"]),
  },
  directives: {
    btn: {
      inserted: function (el, binding) {
        let _this = binding.value.that;
        let btnName = el.innerText.replace(" ", "");
        setTimeout(() => {
          if (_this.btnData) {
            _this.btnData.forEach((item) => {
              if (item.menu_name === btnName) {
                el.parentNode.removeChild(el);
              }
              if (item.menu_code === "tonghualuyin-export") {
                _this.isExport = false;
              }
              if (item.menu_code === "tonghualuyin-detail") {
                _this.isRecording = false;
              }
            });
          }
        }, 50);
      },
    },
  },
  created() {
    this.setBtnData();
    let path = this.$route.path.split("/").pop();
    let routeId = this.getRouteIdByPath()(path);
    this.getBtnList(routeId).then((res) => {
      this.setBtnData(res.data);
    });
    this.searchdataSource[4].options = this.departmentArr;
    this.getCallList();
  },
  methods: {
    ...mapGetters("account", ["getRouteIdByPath"]),
    ...mapMutations("account", ["setBtnData"]),
    ...mapActions("account", ["getBtnList"]),

    // 获取查询参数
    searchChange(searchParams) {
      this.pagination.current = 1;
      this.searchParams = searchParams || {};
      this.getCallList();
    },

    // 获取通话列表
    getCallList() {
      let defaultParams = {};
      this.searchdataSource.forEach((item) => {
        defaultParams[item.fieldName] = item.defaultValue;
      });
      Object.assign(defaultParams, this.searchParams);
      this.loading = true;
      let fromTime = undefined,
        toTime = undefined;
      if (defaultParams.dateRange) {
        fromTime = defaultParams.dateRange[0].valueOf();
        toTime = defaultParams.dateRange[1].valueOf();
      }
      if (defaultParams.type && defaultParams.type == "0") {
        delete defaultParams.type;
      } else if (defaultParams.type) {
        defaultParams.type = parseInt(defaultParams.type);
      }
      if (defaultParams.dept_id == "0") {
        defaultParams.dept_id = "";
      }
      let payload = {
        data: {
          pageNum: this.pagination.current,
          pageSize: this.pagination.pageSize,
          ...defaultParams,
          fromTime,
          toTime,
        },
      };
      this.$mqtt.doPublish(
        {
          pubTopic: "mdm/callInfo/searchCallInfoByPage",
          payload,
        },
        (topic, data) => {
          this.loading = false;
          if (data.code === 200) {
            this.tabDataList = data.data;
            this.pagination.total = data.data.count;
          } else {
            this.$message.error(data.message);
          }
        },
        this
      );
    },
    // 录音详情
    recordingDetails(v) {
      if (v.trans_status == 2) {
        /* let webTvv = ["WEBVTT "];
        v.content &&
          v.content.forEach((item) => {
            webTvv.push(this.transVtt(item));
          });
        let blob = new Blob([webTvv.join("\n\n")], {
          type: "text/vtt",
        });
        var url = URL.createObjectURL(blob);
        v.vtt = url; */
        let text = [];
        v.content &&
          v.content.forEach((item) => {
            text.push(item.onebest);
          });
        console.log(text);
      }
      this.modalData = v;
      //this.modalData.progress = 0;
      this.visible = true;
    },

    transVtt(item) {
      let s = parseInt(item.bg),
        e = parseInt(item.ed);
      s = moment.duration(s);
      s = moment({
        h: s.hours(),
        m: s.minutes(),
        s: s.seconds(),
        ms: s.milliseconds(),
      }).format("HH:mm:ss.SSS");

      e = moment.duration(e);
      e = moment({
        h: e.hours(),
        m: e.minutes(),
        s: e.seconds(),
        ms: e.milliseconds(),
      }).format("HH:mm:ss.SSS");
      return `${s} --> ${e} line:30%\n<v s${item.speaker}>${item.onebest}`;
    },

    // 播放录音
    callRecordExport() {
      this.isExportText = "isExportText";
    },
    // 通话录音导出
    exportOk(val) {
      this.isExportText = "";
      let fromTime = undefined,
        toTime = undefined;
      if (val.dateRange) {
        fromTime = val.dateRange[0].valueOf();
        toTime = val.dateRange[1].valueOf();
      }
      if (val.type && val.type == "0") {
        delete val.type;
      } else if (val.type) {
        val.type = parseInt(val.type);
      }
      if (val.dept_id == "0") {
        val.dept_id = " ";
      }
      let payload = {
        data: {
          ...val,
          fromTime,
          toTime,
        },
      };
      this.$mqtt.doPublish(
        {
          pubTopic: "mdm/callInfo/exportCallInfo",
          payload,
        },
        (topic, data) => {
          if (data.code === 200) {
            console.log(data);
            window.open(data.data.url, "_blank");
          }
        },
        this
      );
    },
    // 播放录音
    playRecord(v) {
      let url = v.url;
      console.log(url);
    },
    //停止播放
    stopPlayVoice() {},
    transRecord(val) {
      let that = this;
      this.$confirm({
        title: "提示",
        content: "确定要转码该录音吗？",
        okText: "确定",
        cancelText: "取消",
        onOk() {
          that.$mqtt.doPublish(
            {
              pubTopic: "mdm/voice/transform",
              payload: {
                id: val._id,
                msgId: "transform",
              },
            },
            (topic, data) => {
              if (data.code !== 200) {
                that.$message.error(data.message || "转码失败");
              }
              if (data.code === 200) {
                val.trans_status = data.status;
                //0 未转码 1 转码中 2 转码成功 3 转码失败
                if (data.id && data.id == val._id) {
                  let message = "";
                  switch (data.status) {
                    case 0:
                      message = "未转码";
                      break;
                    case 1:
                      message = "转码中";
                      break;
                    case 2:
                      message = "转码成功";
                      break;
                    case 3:
                      message = "转码失败";
                      break;
                    default:
                      message = "未知错误";
                      break;
                  }
                  that.$message.success(message);
                  that.getCallList();
                  that.visible = false;
                } else {
                  console.log("不是这一条数据的消息");
                }
              }
            },
            this
          );
        },
        onCancel() {},
      });
    },
    viewRecord(v) {
      console.log(v);
    },
    // 监听分页
    handleTableChange(pagination) {
      this.pagination.current = pagination.current;
      this.pagination.pageSize = pagination.pageSize;
      this.getCallList();
    },
  },
};
</script>

<style lang="less" scoped>
.call-detail-modal {
  .ant-row {
    padding: 8px;
  }
  .with-caption {
    width: 100%;
    height: 120px;
  }
  .with-caption::cue {
    font-size: 14px;
    background-color: #fff;
  }
  .with-caption::cue(b) {
    font-size: 16px;
  }
  .with-caption::cue(v[voice="s0"]) {
    color: rgba(0, 0, 0, 0.65);
  }
  .with-caption::cue(v[voice="s1"]) {
    color: @primary-color;
  }
  audio {
    height: 30px;
    width: 100%;
  }
}
</style>
