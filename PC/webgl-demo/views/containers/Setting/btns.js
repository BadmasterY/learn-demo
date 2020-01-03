const btns = [
    {
        key: 'useReflective',
        name: '高光效果:',
        callback: function(obj, isOpen){
            obj.useReflective = isOpen;
        }
    },
    {
        key: 'useFXAA',
        name: '抗锯齿:',
        callback: function(obj, isOpen){
            obj.useFXAA = isOpen;
        }
    },
    {
        key: 'useShadow',
        name: '阴影效果:',
        callback: function(obj, isOpen){
            obj.useShadow = isOpen;
        }
    },
    {
        key: 'useFocusing',
        name: '聚焦效果:',
        callback: function(obj, isOpen){
            obj.useFocusing = isOpen;
        }
    },
    {
        key: 'speedMode',
        name: '极速模式:',
        callback: function(obj, isOpen){
            obj.speedMode = isOpen;
        }
    }
];

export default btns;