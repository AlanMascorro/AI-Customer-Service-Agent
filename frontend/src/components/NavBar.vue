<!-- NavBar is a reusable UI component; that is why it should be placed in a components folder rather than the "views" folder. -->
<!-- NavBar should appear on multiple pages -->

<template>
    <nav class="navbar">
        <ul class="left">
        <!--<img src="../assets/split-content-3-2-firehouse-logo_spujby.webp" alt="Firehouse Subs Logo" class="logo"/> -->
            <li class="focus">
                <!-- <h1>Sidebar</h1> -->
                <img src="../assets/sidebar-svgrepo-com.svg" style="width: 3vw" />
            </li>
            <li class="focus">
                <h1>Menu</h1>
            </li>
            <li>
                <img src="../assets/firehouse-subs-logo.png" alt="Firehouse Subs Logo" class="logo" />
            </li>
        </ul>
        <ul class="right">
            <li>
                <h1>Your Orders</h1>
            </li>
        </ul>
    </nav>
</template>

<!-- <script setup>
</script> -->

<style>
    .navbar {
        background-color: #ffff;
        border-bottom: 1px solid grey;
        display: flex;
        justify-content: space-between; /* so that ul are at left and right ends */
        position: fixed;
        width: 100vw;
        top: 0;

        & ul {
            display: flex;
            justify-content: space-evenly;
            text-decoration: none;

            & li {
                display: flex; /* row by default */
                align-items: center; /* cross-axis = y, so vertically centered */
                padding: 0.5rem;

                /* We want everything but the logo to change background-color on hover */
                &:hover:not(:has(.logo)) {
                    background-color: gainsboro;
                }
            }
        }

        & .left {
            /* background-color: yellow; */

            & .logo {
                width: 10vw;
                height: auto; /* Maintains aspect ratio */
                /* background-color: red; */
            }


            & li {
                /* background-color: orange; */
                margin-left: 2rem; /* top, right, bottom, left */
            }
        }

        & .right {
            /* background-color: green; */

            & li {
                /* background-color: orange; */
                margin-right: 2rem;
            }
        }

        & h1 {
            font-weight: bold;
        }
    }
</style>






<!-- EXTRA CODE -->
<!-- "justify-between" so that li are at left and right ends, "no-underline" removes bullet point
<nav class="bg-white border-b-2 border-gray-200 sticky top-0 flex justify-between">
    <ul class="left flex bg-yellow-300 justify-evenly no-underline">
    <img src="../assets/split-content-3-2-firehouse-logo_spujby.webp" alt="Firehouse Subs Logo" class="logo"/> 
        <li>
            <h1>hello</h1>
        </li>
        <li>
            <img src="../assets/firehouse-subs-logo.png" alt="Firehouse Subs Logo" class="h-auto" style="width: 10vw">
        </li>
    </ul>
    <ul class="bg-green-600 no-underline">
        <li>
            <h1>wassup</h1>
        </li>
    </ul>
</nav> -->