function datePicker($className) {
    this.init($className); //初始化

    this.render(); //模板

    this.setData(); //设置数据

    this.bind(); //绑定事件

}

datePicker.prototype = {
    init: function ($className) {
        this.$target = $className;
        let cur_date = $className.attr('data-init');
        let top = $className.offset().top;
        let left = $className.offset().left;
        let height = $className.outerHeight();
        this.top = top + height;
        this.left = left;
        if (this.isValidDate(cur_date)) {
            this.date = new Date(cur_date);
            this.watchDate = new Date(cur_date);
        }else{
            this.date = new Date();
            this.watchDate = new Date();
        }
    },

    render: function () {
        var mask = '<div class="ui-date-picker-mask"></div>';
        var tpl = '<div class="ui-date-picker">' +
                  '<div class="header">' +
                  '<span class="pre caret-left"></span>' +
                  '<span class="cur header-date">111</span>' +
                  '<span class="next caret-right"></span>' +
                  '</div>' +
                  '<table class="panel">' +
                  '<thead><tr>' +
                  '<th>一</th><th>二</th><th>三</th><th>四</th><th>五</th><th>六</th><th>日</th>' +
                  '</tr></thead>' +
                  '<tbody></tbody>' +
                  '</table>' +
                  '</div>';
        this.$mask = $(mask);
        this.$datePicker = $(tpl);
        $('body').append(this.$mask);
        $('body').append(this.$datePicker);
        this.$datePicker.css({
            'top':this.top,
            'left':this.left
        });
    },

    setData: function () {
        var data = [];
        $('.ui-date-picker').find('tbody').html('');
        var firstDay = this.getFirstDay(this.watchDate);
        var lastDay = this.getLastDay(this.watchDate);

        for(var i = firstDay.getDay()-1;i>0;i--){
            var day = new Date(firstDay).getTime() - i*1000*60*60*24;
            data.push({type:'pre',date:day});
        }

        for (var i = 0; i < lastDay.getDate(); i++) {
            var day = new Date(firstDay).getTime() + i*1000*60*60*24;
            data.push({type:'cur',date:day});
        }

        for (var i = 1; lastDay.getDay()!=0 && i <= 7 - lastDay.getDay(); i++) {
            var day = new Date(lastDay).getTime() + i*1000*60*60*24;
            data.push({type:'next',date:day});
        }

        this.$datePicker.find('.header-date').text(this.watchDate.getFullYear()+'年'+(this.watchDate.getMonth()+1)+'月');

        var tpl = '';

        for (var i = 0; i < data.length; i++) {
            if(i%7 === 0){
                tpl += '<tr>';
            }

            tpl += '<td class="' + data[i].type + '-month';
            if(this.isToday(data[i].date)){
                tpl += ' cur-date';
            }
            tpl += '" data-date="'+ this.setData_Date(data[i].date) +'">' + new Date(data[i].date).getDate() +
                    '</td>';

            if (i%7 === 6) {
                tpl += '</tr>';
            }
        }

        this.$datePicker.find('tbody').html(tpl);
    },

    bind: function () {
        var self = this;

        this.$datePicker.find('.pre').on('click', function(){
            self.watchDate = self.getPreMonth(self.watchDate);
            self.setData();
        });
        this.$datePicker.find('.next').on('click', function(){
            self.watchDate = self.getNextMonth(self.watchDate);
            self.setData();
        });
        this.$datePicker.on('click', '.cur-month', function(){
            self.$target.val($(this).attr('data-date'))
            $('.ui-date-picker').remove();
            $('.ui-date-picker-mask').remove();
        });

        this.$mask.click(function(){
            $('.ui-date-picker').remove();
            $('.ui-date-picker-mask').remove();
        })
    },

    //获取date 所在月份的第一天的时间对象
    getFirstDay: function (date) {
        var year = date.getFullYear();
        var month = date.getMonth();
        return new Date(year,month,1);
    },

    //获取 date 所在月份最后一天的时间对象
    getLastDay: function (date) {
        var year = date.getFullYear();
        var month = date.getMonth()+1;
        return new Date(year,month,0);
    },

    //获取date 上月1号时间对象
    getPreMonth: function(date){
        var year = date.getFullYear(),
            month = date.getMonth();
        month--;
        if (month < 0) {
            month = 11;
            year--;
        }
        return new Date(year, month, 1);
    },

    //获取date 下月1号时间对象
    getNextMonth: function(date){
        var year = date.getFullYear(),
            month = date.getMonth();
        month++;
        if (month > 11) {
            month = 0;
            year++;
        }
        return new Date(year, month, 1);
    },

    isToday: function (date) {
        var today = new Date();
        var curDate = new Date(date);
        return today.getFullYear() == curDate.getFullYear() && today.getMonth() == curDate.getMonth() && today.getDate() == curDate.getDate();
    },

    isValidDate: function (dateStr) {
        return new Date(dateStr).toString() !== 'Invalid Date';
    },

    setData_Date: function (date) {
        var curDate = new Date(date);
        var year = curDate.getFullYear();
        var month = parseInt(curDate.getMonth())+1;
        var day = curDate.getDate();
        return year +'-'+ month +'-'+ day;
    }
}
