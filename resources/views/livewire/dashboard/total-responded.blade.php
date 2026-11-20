<div class="px-4 h-fit"> 
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div class="p-4 dark:bg-gray-800 bg-white rounded shadow text-center">
            <p class="text-gray-500 dark:text-white">Total Semua Responden</p>
            <p class="text-2xl font-bold text-black dark:text-white">{{ $totalSemuaResponden ?? 0 }}</p>
        </div>
        <div class="p-4 dark:bg-gray-800 bg-white rounded shadow text-center border-l-4 border-blue-500">
            <p class="text-gray-500 dark:text-white">Terdaftar (Email)</p>
            <p class="text-2xl font-bold text-blue-600 dark:text-blue-400">{{ $respondenTerdaftar?? 0 }}</p>
        </div>
        <div class="p-4 dark:bg-gray-800 bg-white rounded shadow text-center border-l-4 border-orange-500">
            <p class="text-gray-500 dark:text-white">Anonim (No-Email)</p>
            <p class="text-2xl font-bold text-orange-600 dark:text-orange-400">{{ $respondenAnonim ?? 0}}</p>
        </div>
    </div>
    
    <div class="flex lg:flex-nowrap flex-wrap md:gap-3 gap-10 m-4 mb-12">
        <div class="flex w-full h-fit items-center justify-start flex-col rounded-md bg-white dark:bg-gray-800 shadow-md">
            <div class="text-center rounded bg-blue-600 dark:bg-violet-700 w-full p-1">
                <p class="lg:text-xl text-white">
                    Interaktif Page
                </p>
            </div>
            <div class="flex flex-row xl:flex-nowrap flex-wrap items-start justify-center w-full h-full">
                <div class="py-4 text-center flex items-center justify-center flex-col rounded w-full h-full">
                    <p class="lg:text-xl text-black dark:text-white">
                        Responden
                    </p>
                    
                    <p class="lg:text-2xl text-black dark:text-white">{{ $groupedResponses['interaktif']['responden']['count'] ?? '0' }}</p>

                    <div class="text-white mt-2 text-center flex flex-row items-center justify-center rounded bg-gradient-to-r from-blue-600 to-blue-700 dark:from-gray-800 dark:to-violet-600 w-[85%] h-fit">
                        <div class="py-2 text-center flex items-center justify-center flex-col rounded w-full h-full">
                            <p class="xl:text-xl">
                                Email
                            </p>
                            <p class="xl:text-2xl">{{ $groupedResponses['interaktif']['responden']['email'] ?? '0' }}</p>
                        </div>
                        <div class="py-2 text-center flex items-center justify-center flex-col rounded w-full h-full">
                            <p class="xl:text-xl">
                                No-email
                            </p>
                            <p class="xl:text-2xl">{{ $groupedResponses['interaktif']['responden']['no-email'] ?? '0' }}</p>
                        </div>
                    </div>
                </div>
                <div class="py-4 text-center flex items-center justify-center flex-col rounded w-full h-full">
                    <p class="lg:text-xl text-black dark:text-white">
                        Responses
                    </p>
                    
                    <div class="text-white mt-2 text-center flex flex-row items-center justify-center rounded bg-gradient-to-r from-blue-600 to-blue-700 dark:from-gray-800 dark:to-violet-600 w-[90%] h-fit">
                        <div class="py-2 text-center flex items-center justify-center flex-col rounded w-full h-full">
                            <p class="xl:text-xl">
                                Pre-Test
                            </p>
                            <p class="xl:text-2xl">{{ $groupedResponses['interaktif']['responses']['pre-test']['count'] ?? '0' }}</p>

                            <div class="py-1 px-2 text-black mt-2 flex flex-col items-center justify-center rounded bg-white w-[90%] h-fit">
                                <table class="text-sm text-start w-full">
                                    <tr>
                                        <td>email</td>
                                        <td>{{ $groupedResponses['interaktif']['responses']['pre-test']['email'] ?? '0' }}</td>
                                    </tr>
                                    <tr>
                                        <td>no-email</td>
                                        <td>{{ $groupedResponses['interaktif']['responses']['pre-test']['no-email'] ?? '0' }}</td>
                                    </tr>
                                </table>
                            </div>
                        </div>
                        <div class="py-2 text-center flex items-center justify-center flex-col rounded w-full h-full">
                            <p class="xl:text-xl">
                                Post-Test
                            </p>
                            <p class="xl:text-2xl">{{ $groupedResponses['interaktif']['responses']['post-test']['count'] ?? '0' }}</p>
                            <div class="py-1 px-2 text-black mt-2 flex flex-col items-center justify-center rounded bg-white w-[90%] h-fit">
                                <table class="text-sm text-start w-full">
                                    <tr>
                                        <td>email</td>
                                        <td>{{ $groupedResponses['interaktif']['responses']['post-test']['email'] ?? '0' }}</td>
                                    </tr>
                                    <tr>
                                        <td>no-email</td>
                                        <td>{{ $groupedResponses['interaktif']['responses']['post-test']['no-email'] ?? '0'}}</td>
                                    </tr>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="flex w-full h-fit items-center justify-start flex-col rounded-md bg-gray-50 dark:bg-gray-800 shadow-md">
            <div class="text-center rounded bg-blue-600 dark:bg-violet-700 w-full p-1">
                <p class="lg:text-xl text-white">
                    Emodul Page
                </p>
            </div>
            <div class="flex flex-row xl:flex-nowrap flex-wrap items-start justify-center rounded-md w-full h-full bg-gray-50 dark:bg-gray-800">
                <div class="py-4 text-center flex items-center justify-center flex-col w-full h-full">
                    <p class="lg:text-xl text-black dark:text-white">
                        Responden
                    </p>

                    <p class="lg:text-2xl text-black dark:text-white">{{ $groupedResponses['emodul']['responden']['count'] ?? '0' }}</p>

                    <div class="text-white mt-2 text-center flex flex-row items-center justify-center rounded bg-gradient-to-r from-blue-600 to-blue-700 dark:from-gray-800 dark:to-violet-600 w-[85%] h-fit">
                        <div class="py-2 text-center flex items-center justify-center flex-col rounded w-full h-full">
                            <p class="xl:text-xl">
                                Email
                            </p>
                            <p class="xl:text-2xl">{{ $groupedResponses['emodul']['responden']['email'] ?? '0' }}</p>
                        </div>
                        <div class="py-2 text-center flex items-center justify-center flex-col rounded w-full h-full">
                            <p class="xl:text-xl">
                                No-email
                            </p>
                            <p class="xl:text-2xl">{{ $groupedResponses['emodul']['responden']['no-email'] ?? '0' }}</p>
                        </div>
                    </div>
                </div>
                <div class="py-4 text-center flex items-center justify-center flex-col rounded w-full h-full">
                    <p class="lg:text-xl text-black dark:text-white">
                        Responses
                    </p>

                    <div class="text-white mt-2 text-center flex flex-row items-center justify-center rounded bg-gradient-to-r from-blue-600 to-blue-700 dark:from-gray-800 dark:to-violet-600 w-[90%] h-fit">
                        <div class="py-2 text-center flex items-center justify-center flex-col rounded w-full h-full">
                            <p class="xl:text-xl">
                                Pre-Test
                            </p>
                            <p class="xl:text-2xl">{{ $groupedResponses['emodul']['responses']['pre-test']['count'] ?? '0' }}</p>

                            <div class="py-1 px-2 text-black mt-2 flex flex-col items-center justify-center rounded bg-white w-[90%] h-fit">
                                <table class="text-sm text-start w-full">
                                    <tr>
                                        <td>email</td>
                                        <td>{{ $groupedResponses['emodul']['responses']['pre-test']['email'] ?? '0' }}</td>
                                    </tr>
                                    <tr>
                                        <td>no-email</td>
                                        <td>{{ $groupedResponses['emodul']['responses']['pre-test']['no-email'] ?? '0' }}</td>
                                    </tr>
                                </table>
                            </div>
                        </div>
                        <div class="py-2 text-center flex items-center justify-center flex-col rounded w-full h-full">
                            <p class="xl:text-xl">
                                Post-Test
                            </p>
                            <p class="xl:text-2xl">{{ $groupedResponses['emodul']['responses']['post-test']['count'] ?? '0' }}</p>
                            <div class="py-1 px-2 text-black mt-2 flex flex-col items-center justify-center rounded bg-white w-[90%] h-fit">
                                <table class="text-sm text-start w-full">
                                    <tr>
                                        <td>email</td>
                                        <td>{{ $groupedResponses['emodul']['responses']['post-test']['email'] ?? '0' }}</td>
                                    </tr>
                                    <tr>
                                        <td>no-email</td>
                                        <td>{{ $groupedResponses['emodul']['responses']['post-test']['no-email'] ?? '0' }}</td>
                                    </tr>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>