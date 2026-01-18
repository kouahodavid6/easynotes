import PropTypes from 'prop-types';

const StatCard = ({ title, value, icon, iconBgColor, subtitle, isLoading }) => {
    const Icon = icon;
    
    return (
        <div className="bg-white rounded-2xl p-6 border border-pink-100 shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-gray-500 text-sm mb-1">{title}</p>
                    {isLoading ? (
                        <div className="h-8 w-20 bg-gray-200 rounded animate-pulse"></div>
                    ) : (
                        <p className="text-3xl font-bold text-gray-900">{value}</p>
                    )}
                    {subtitle && <p className="text-gray-400 text-xs mt-1">{subtitle}</p>}
                </div>
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${iconBgColor} flex items-center justify-center`}>
                    <Icon className="w-6 h-6 text-white" />
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
    isLoading: PropTypes.bool
};

StatCard.defaultProps = {
    subtitle: '',
    isLoading: false
};

export default StatCard;