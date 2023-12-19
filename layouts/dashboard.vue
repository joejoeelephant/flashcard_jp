<template>
    <div class="common-layout">
        <el-container class="h-screen">
            <el-aside width="200px">
                <DashboardAside />
            </el-aside>
            <el-container>
                <el-header class="bg-blue-300">
                    <DashboardHeader/>
                </el-header>
                <el-main>
                    <slot/>
                </el-main>
            </el-container>
        </el-container>
    </div>
  </template>
<script setup lang="ts">

</script>
<style lang="">
    
</style>