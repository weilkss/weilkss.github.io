<template>
    <div class="rvloading-wrapper">
        <RVLoading></RVLoading>
        <RVLoading size="32" color="red"></RVLoading>
        <RVLoading size="64"></RVLoading>
        <RVLoading :size="72" color="red"></RVLoading>
    </div>
</template>

<script setup>
import RVLoading from "react-vue-loading";
</script>

<style scoped>
.rvloading-wrapper {
    display: flex;
    align-items: center;
    gap: 24px;
    flex-wrap: wrap;
    justify-content: center;
    padding: 32px;
    background: #f5f5f5;
    border-radius: 8px;
}
</style>
