<template lang="">
    <header class="flex h-16 items-center relative shadow-lg shadow-slate-200 px-4 bg-white">
        <div class="container mx-auto">
            <div class="w-full h-full flex justify-between items-center bg-white">
                <div class="font-bold text-2xl">
                    <NuxtLink to="/">
                        Logo
                    </NuxtLink>
                </div>
                <div class="flex-1 hidden md:flex justify-center ">
                    <ul class="flex gap-8">
                        <li v-for="(item, index) in navItems" :key="index">
                            <NuxtLink :to="item.url">
                                {{item.name}}
                            </NuxtLink>
                        </li>
                    </ul>
                </div>
                <div class="md:hidden block" @click="toggleNav()">
                    <div class="hamburger" ><span></span></div>
                </div>
            </div>
            
        </div>
        <div class="absolute z-50 top-full left-0 backdrop-blur-lg bg-white w-full transition-all duration-300 overflow-hidden shadow-lg shadow-slate-200 md:hidden" :style="navOpen ? 'height: 232px' : 'height: 0px'">
                    <ul class="flex flex-col gap-6 p-8">
                        <li v-for="(item, index) in navItems" :key="index" >
                            <NuxtLink :to="item.url" class="block py-2">
                                {{item.name}}
                            </NuxtLink>
                        </li>
                    </ul>
            </div>
    </header>
</template>
<script setup lang="ts">
    interface NavItem {
        name: string
        url: string
    }
    const navItems: NavItem[] = [
        {
            name: "cards",
            url: "/cards"
        },
        {
            name: "verbs",
            url: "/verbs"
        },
        {
            name: "dashboard",
            url: "/dashboard/cards"
        }
    ]
    const navOpen = ref<boolean>(false)

    const toggleNav = () => {
        navOpen.value = !navOpen.value
        console.log(123)
    }
</script>
<style lang="css">
.hamburger {
    --space: 0.4rem;
    --line-width: 2px;
    --color-primary: #333;
    position: relative;
    width: 22px;
    height: calc(var(--space)*2 + var(--line-width) * 2)
}

.hamburger span {
    position: absolute;
    width: 100%;
    height: var(--line-width);
    background: var(--color-primary);
    transform-origin: center center;
    transition: transform 0.3s;
}

.hamburger span::before {
    content: "";
    position: absolute;
    width: 100%;
    height: var(--line-width);
    background: var(--color-primary);
    top: var(--space);
    transform-origin: center center;
    transition: transform 0.3s;
}

.hamburger span::after {
    content: "";
    position: absolute;
    width: 100%;
    height: var(--line-width);
    background: var(--color-primary);
    top: calc(var(--space) * 2);
    transform-origin: center center;
    transition: transform 0.3s;

}

.hamburger.active span {
    transform: translateY(var(--space)) rotate(-45deg);
}

.hamburger.active span::before {
    transform: translateY(calc(var(--space) * -1)) rotate(90deg);
}

.hamburger.active span::after {
    transform: translateY(calc(var(--space) * -2)) rotate(90deg);
    /* opacity: 0; */
}
</style>