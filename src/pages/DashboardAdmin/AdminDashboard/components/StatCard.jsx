import PropTypes from 'prop-types';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';

const StatCard = ({ 
    title, 
    value, 
    icon: IconComponent,  // Renommé en IconComponent
    iconBgColor, 
    subtitle, 
    isLoading, 
    trend,
    trendValue 
}) => {
    
    const getTrendInfo = () => {
        switch(trend) {
            case 'up':
                return {
                    icon: ArrowUpRight,
                    color: 'text-green-600',
                    bgColor: 'bg-green-100',
                    text: trendValue ? `+${trendValue}` : '+'
                };
            case 'down':
                return {
                    icon: ArrowDownRight,
                    color: 'text-red-600',
                    bgColor: 'bg-red-100',
                    text: trendValue ? `${trendValue}` : '-'
                };
            default:
                return {
                    icon: Minus,
                    color: 'text-gray-600',
                    bgColor: 'bg-gray-100',
                    text: 'Stable'
                };
        }
    };

    const trendInfo = getTrendInfo();
    const TrendIcon = trendInfo.icon;
    
    return (
        <div className="bg-white rounded-2xl p-6 border border-pink-100 shadow-sm hover:shadow-md transition-all duration-300">
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <p className="text-gray-500 text-sm mb-1">{title}</p>
                    {isLoading ? (
                        <div className="space-y-2">
                            <div className="h-8 w-20 bg-gray-200 rounded animate-pulse"></div>
                            <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                        </div>
                    ) : (
                        <>
                            <p className="text-3xl font-bold text-gray-900">{value}</p>
                            {subtitle && (
                                <div className="flex items-center gap-2 mt-2">
                                    <p className="text-gray-400 text-sm">{subtitle}</p>
                                    {trend && (
                                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${trendInfo.bgColor} ${trendInfo.color}`}>
                                            <TrendIcon className="w-3 h-3" />
                                            {trendInfo.text}
                                        </span>
                                    )}
                                </div>
                            )}
                        </>
                    )}
                </div>
                {/* Utilisation de IconComponent au lieu de Icon */}
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${iconBgColor} flex items-center justify-center flex-shrink-0`}>
                    <IconComponent className="w-6 h-6 text-white" />
                </div>
            </div>
        </div>
    );
};

StatCard.propTypes = {
    title: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    icon: PropTypes.elementType.isRequired,
    iconBgColor: PropTypes.string.isRequired,
    subtitle: PropTypes.string,
    isLoading: PropTypes.bool,
    trend: PropTypes.oneOf(['up', 'down', 'neutral']),
    trendValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
};

StatCard.defaultProps = {
    subtitle: '',
    isLoading: false,
    trend: null,
    trendValue: null
};

export default StatCard;