
const colorClasses = [
    'bg-red-500',
    'bg-blue-500',
    'bg-green-500',
    'bg-yellow-500',
    
];

export const getRandomColorClass = (name) => {
    const randomIndex = name.length % colorClasses.length;
    return colorClasses[randomIndex];
};